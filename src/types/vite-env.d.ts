/// <reference types="vite/client" />
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly NODE_ENV: "development" | "production" | "test";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
