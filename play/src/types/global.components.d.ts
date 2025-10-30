declare module "vue" {
  export interface GlobalComponents {
    CAutoTooltip: (typeof import("ep-toolkit"))["CAutoTooltip"];
    CForm: (typeof import("ep-toolkit"))["CForm"];
    CSearchForm: (typeof import("ep-toolkit"))["CSearchForm"];
    CTable: (typeof import("ep-toolkit"))["CTable"];
  }
}

export {};
