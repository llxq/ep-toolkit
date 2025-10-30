const getUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

type Status = "published" | "draft" | "deleted";

export interface ITableItem {
  id: string;
  title: string;
  type: string;
  status: Status;
  date: string;
  author: string;
  description?: string;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockData: ITableItem[] = [
  {
    id: "1",
    title: "2023年Q1销售报告",
    type: "季报",
    status: "published",
    date: "2023-04-15",
    author: "张三",
    description: "2023年第一季度销售情况总结与分析",
    views: 1245,
    tags: ["销售", "季度报告", "财务"],
    createdAt: "2023-04-10T09:30:00Z",
    updatedAt: "2023-04-15T14:20:00Z",
  },
  {
    id: "2",
    title: "产品需求文档 - 用户中心V2.0",
    type: "产品文档",
    status: "draft",
    date: "2023-05-20",
    author: "李四",
    description: "用户中心功能升级需求文档",
    views: 89,
    tags: ["产品", "需求", "用户中心"],
    createdAt: "2023-05-15T10:15:00Z",
    updatedAt: "2023-05-20T16:45:00Z",
  },
  {
    id: "3",
    title: "2023年度技术规划",
    type: "年度规划",
    status: "published",
    date: "2023-01-05",
    author: "王五",
    description: "2023年技术部发展规划与目标",
    views: 876,
    tags: ["技术", "规划", "年度"],
    createdAt: "2023-01-01T08:00:00Z",
    updatedAt: "2023-01-05T11:30:00Z",
  },
  {
    id: "4",
    title: "市场调研报告 - 竞品分析",
    type: "调研报告",
    status: "published",
    date: "2023-03-12",
    author: "赵六",
    description: "主要竞争对手产品功能与市场表现分析",
    views: 654,
    tags: ["市场", "竞品", "分析"],
    createdAt: "2023-03-10T14:20:00Z",
    updatedAt: "2023-03-12T09:15:00Z",
  },
  {
    id: "5",
    title: "2023年6月运营数据",
    type: "月报",
    status: "published",
    date: "2023-07-05",
    author: "钱七",
    description: "2023年6月平台运营数据汇总",
    views: 432,
    tags: ["运营", "数据", "月报"],
    createdAt: "2023-07-01T10:00:00Z",
    updatedAt: "2023-07-05T15:30:00Z",
  },
  {
    id: "6",
    title: "新员工培训计划",
    type: "培训资料",
    status: "draft",
    date: "2023-08-20",
    author: "孙八",
    description: "2023年Q3新员工入职培训计划",
    views: 56,
    tags: ["培训", "人力资源", "计划"],
    createdAt: "2023-08-15T13:45:00Z",
    updatedAt: "2023-08-20T11:20:00Z",
  },
  {
    id: "7",
    title: "2023年Q2财务报告",
    type: "季报",
    status: "published",
    date: "2023-07-20",
    author: "周九",
    description: "2023年第二季度财务数据汇总",
    views: 321,
    tags: ["财务", "季度报告", "数据"],
    createdAt: "2023-07-18T09:15:00Z",
    updatedAt: "2023-07-20T16:30:00Z",
  },
  {
    id: "8",
    title: "产品功能需求 - 支付系统优化",
    type: "产品文档",
    status: "deleted",
    date: "2023-06-10",
    author: "吴十",
    description: "支付系统功能优化需求文档",
    views: 78,
    tags: ["产品", "支付", "优化"],
    createdAt: "2023-06-05T14:30:00Z",
    updatedAt: "2023-06-10T10:45:00Z",
  },
  {
    id: "9",
    title: "2023年8月市场活动总结",
    type: "活动报告",
    status: "published",
    date: "2023-09-05",
    author: "郑十一",
    description: "2023年8月市场活动效果分析报告",
    views: 543,
    tags: ["市场", "活动", "总结"],
    createdAt: "2023-09-01T11:20:00Z",
    updatedAt: "2023-09-05T15:10:00Z",
  },
  {
    id: "10",
    title: "技术架构演进方案",
    type: "技术文档",
    status: "draft",
    date: "2023-09-15",
    author: "王五",
    description: "系统架构升级与演进方案",
    views: 67,
    tags: ["技术", "架构", "方案"],
    createdAt: "2023-09-10T09:45:00Z",
    updatedAt: "2023-09-15T14:25:00Z",
  },
];

// 模拟数据库
let data = [...mockData];

interface IPaginationParams {
  current: number;
  pageSize: number;
}

interface QueryParams
  extends Partial<Omit<ITableItem, "id" | "createdAt" | "updatedAt">> {
  dateRange?: [string, string];
  keyword?: string;
}

export const useTableApi = () => {
  // 获取列表（带分页和查询）
  const getTableList = async (params: IPaginationParams & QueryParams) => {
    const { current = 1, pageSize = 10, ...queryParams } = params;

    // 过滤数据
    let filteredData = [...data];

    // 应用查询条件
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (!value) return;

        switch (key) {
          case "title":
          case "author":
          case "description":
            filteredData = filteredData.filter((item) =>
              item[key].toLowerCase().includes(String(value).toLowerCase()),
            );
            break;
          case "type":
          case "status":
            filteredData = filteredData.filter((item) => item[key] === value);
            break;
          case "dateRange":
            if (value && Array.isArray(value) && value.length === 2) {
              const [start, end] = value;
              filteredData = filteredData.filter(
                (item) => item.date >= start && item.date <= end,
              );
            }
            break;
          case "keyword": {
            const keyword = String(value).toLowerCase();
            filteredData = filteredData.filter(
              (item) =>
                item.title.toLowerCase().includes(keyword) ||
                item.description?.toLowerCase().includes(keyword) ||
                item.tags.some((tag) => tag.toLowerCase().includes(keyword)),
            );
            break;
          }
        }
      });
    }

    // 分页
    const start = (current - 1) * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    // 模拟一个异步操作
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    return {
      data: paginatedData,
      total: filteredData.length,
      current,
      pageSize,
    };
  };

  // 获取单个详情
  const getTableItem = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (!item) {
      throw new Error("Item not found");
    }
    return { ...item };
  };

  // 创建
  const createTableItem = (
    item: Omit<ITableItem, "id" | "createdAt" | "updatedAt">,
  ) => {
    const now = new Date().toISOString();
    const newItem: ITableItem = {
      ...item,
      id: getUUID(),
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    data.unshift(newItem);
    return { ...newItem };
  };

  // 更新
  const updateTableItem = (id: string, updates: Partial<ITableItem>) => {
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return Promise.resolve({ ...data[index] });
  };

  // 删除
  const deleteTableItem = (id: string) => {
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    // 软删除，将状态标记为已删除
    data[index] = {
      ...data[index],
      status: "deleted",
      updatedAt: new Date().toISOString(),
    };

    return Promise.resolve({ ...data[index] });
  };

  // 批量删除
  const batchDeleteItems = (ids: string[]) => {
    ids.forEach((id) => {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data[index] = {
          ...data[index],
          status: "deleted",
          updatedAt: new Date().toISOString(),
        };
      }
    });

    return { success: true, count: ids.length };
  };

  // 更新状态
  const updateItemStatus = (id: string, status: Status) => {
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    data[index] = {
      ...data[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return { ...data[index] };
  };

  // 获取所有标签
  const getAllTags = () => {
    const tags = new Set<string>();
    data.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  };

  // 获取统计信息
  const getStats = () => {
    const total = data.length;
    const published = data.filter((item) => item.status === "published").length;
    const drafts = data.filter((item) => item.status === "draft").length;
    const deleted = data.filter((item) => item.status === "deleted").length;

    return {
      total,
      published,
      drafts,
      deleted,
      views: data.reduce((sum, item) => sum + item.views, 0),
    };
  };

  // 重置为初始数据
  const resetData = () => {
    data = [...mockData];
    return { success: true };
  };

  return {
    // 查询
    getTableList,
    getTableItem,

    // 增删改
    createTableItem,
    updateTableItem,
    deleteTableItem,
    batchDeleteItems,

    // 其他操作
    updateItemStatus,
    getAllTags,
    getStats,

    // 开发工具
    resetData,
  };
};

// 导出单例
const api = useTableApi();
export default api;
