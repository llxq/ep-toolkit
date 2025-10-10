declare module "vue" {
  export interface GlobalComponents {
    CAutoTooltip: (typeof import("ep-kit"))["CAutoTooltip"];
    CForm: (typeof import("ep-kit"))["CForm"];
    CSearchForm: (typeof import("ep-kit"))["CSearchForm"];
    CTable: (typeof import("ep-kit"))["CTable"];
  }
}

export {};
