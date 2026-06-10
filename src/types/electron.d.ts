interface FingerprintInstallPayload {
  fingerprint: string;
  alias: string;
  overwrite?: boolean;
}

interface UrlInstallPayload {
  url: string;
  alias: string;
}

interface AppCreatePayload {
  alias: string;
  directory: string;
}

interface ManagedAppItem {
  id: string;
  alias: string;
  directory: string;
  indexHtmlPath: string | null;
  iconBase64: string | null;
  hsq: {
    appId: string;
    appName: string;
    appVersion: string;
    appDescription: string;
    mode: "local" | "remote";
    remoteUrl?: string;
    hasIndexHtml?: boolean;
    dev?: boolean;
    gitUrl?: string;
  };
  createdAt?: number;
  updatedAt?: number;
  pinned?: boolean;
}

interface EventCenter {
  getAppId(): string | null;
  invoke(
    namespace: string,
    method: string,
    payload: unknown[]
  ): Promise<unknown>;
  importByFingerprint(payload: FingerprintInstallPayload): Promise<void>;
  importByUrl(payload: UrlInstallPayload): Promise<void>;
  listApps(input?: { reload?: boolean }): Promise<{ apps: ManagedAppItem[] }>;
  refreshApps(): Promise<{ apps: ManagedAppItem[] }>;
  refreshMainAppList(): Promise<{ ok: true }>;
}

declare global {
  interface Window {
    eventCenter?: EventCenter;
  }
}

export {};
