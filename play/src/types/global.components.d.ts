declare module "vue" {
  export interface GlobalComponents {
    CForm: (typeof import("ep-kit"))["CForm"];
    CTable: (typeof import("ep-kit"))["CTable"];
  }
}
export {};
