export interface IMenuItem {
  /**
   * 菜单名称
   */
  name: string;
  /**
   * title
   */
  title: string;
  /**
   * 菜单路径
   */
  path: string;
  /**
   * 子菜单
   */
  children?: IMenuItem[];
  /**
   * 对应的路由代码的 代码
   */
  codePath?: string;
}

export interface IMenuCategory {
  /**
   * 分类名称
   */
  category: string;
  /**
   * 分类对应的菜单
   */
  menu: IMenuItem[];
}

export interface IMenuCategory {
  /**
   * 分类名称
   */
  category: string;
  /**
   * 分类对应的菜单
   */
  menu: IMenuItem[];
}

export interface IMenuStore {
  menuList: IMenuCategory[];
  flatMenuList: IMenuItem[];
  menuCodeMap: TObj<string, string>;
}
