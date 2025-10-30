import type { TCustomRouterDefinition } from "@play/router/types";
import { useMenuStore } from "@play/store/menu";
import type { IMenuCategory, IMenuItem } from "@play/store/menu/type";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

/**
 * 提取动态导入的url
 */
const extractUrlFromDynamicImport = (
  dynamicImportString: string,
): TNullable<string> => {
  const regex = /\(\) => import\(['"](.*?)(?:\?t=\d+)?['"]\)/;
  const match = dynamicImportString.match(regex);
  if (match && match[1]) {
    const url = match[1].split("?")[0];
    if (url) {
      // 替换为相对路径
      return url.replace("/src/views/", "../views/");
    }
  }

  return null;
};

/**
 * 构建代码
 */
const buildCodes = async () => {
  const rawModules = import.meta.glob("../views/**/*.vue", {
    as: "raw",
  });

  const codes: TObj<string, string> = {};
  for (const path in rawModules) {
    const module: string = await rawModules[path]();
    // 格式化下，去掉最开始的空格和回车
    codes[path] = module.replace(/^\s+/, "").replace(/^\n+/, "");
  }

  useMenuStore().setMenuCodeMap(codes);
};

/**
 * 查找views下所有的router.ts文件。不跨层级找，定义在一级目录即可。
 */
export const dynamicBuildRouters = async () => {
  const routers: RouteRecordRaw[] = [];
  const categories: IMenuCategory[] = [];

  void buildCodes();

  // build views
  const viewsMenuList: IMenuItem[] = [];
  const modules = import.meta.glob("../views/**/router.ts");
  const buildMenuList = (
    routerDefinition: TCustomRouterDefinition,
  ): IMenuItem => {
    const { name, title, path, component } = routerDefinition;
    return {
      name,
      title,
      path,
      codePath: extractUrlFromDynamicImport(component?.toString() || "") || "",
      children: routerDefinition.children?.map(buildMenuList) || [],
    };
  };

  for (const path in modules) {
    const module = (await modules[path]()) as {
      default: TCustomRouterDefinition;
    };
    const routerDefinition = module.default;
    if (Array.isArray(routerDefinition)) {
      routerDefinition.forEach((item) => {
        const menuItem = buildMenuList(item);
        viewsMenuList.push(menuItem);
        routers.push(item as RouteRecordRaw);
      });
    } else {
      const menuItem = buildMenuList(routerDefinition);
      viewsMenuList.push(menuItem);
      routers.push(routerDefinition as RouteRecordRaw);
    }
  }
  categories.push({
    category: "组件",
    menu: viewsMenuList,
  });

  // TODO build hooks

  useMenuStore().setMenuList(categories);

  return routers;
};

/**
 * 获取动态路由
 * @returns
 */
export const getDynamicRouters = async () => {
  const routers = await dynamicBuildRouters();

  return createRouter({
    history: createWebHistory(),
    routes: [
      // add layout
      {
        path: "/",
        component: () => import("@play/components/layout/index.vue"),
        children: routers,
      },
      {
        // 404 to form
        path: "/:pathMatch(.*)*",
        redirect: "/form",
      },
    ],
  });
};
