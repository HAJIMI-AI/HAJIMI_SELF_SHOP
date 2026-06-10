export type AppCategory =
  | "Productivity"
  | "Developer Tools"
  | "Utilities"
  | "Design"
  | "Entertainment"
  | "Education";

export interface AppInstallMethods {
  local: boolean;
  downloadZip: boolean;
  fingerprint?: string;
  remoteUrl?: string;
}

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  fullDescription: string;
  category: AppCategory;
  version: string;
  author: string;
  size: string;
  updateDate: string;
  screenshots: string[];
  fingerprint: string;
  remoteUrl?: string;
}

export type AppContext = "main" | "subapp" | "browser";

export type InstallMethodType = "local" | "downloadZip" | "fingerprint" | "url";

export type InstallStatus = "idle" | "installing" | "success" | "error";

export interface InstalledApp {
  appId: string;
  appName: string;
  appVersion: string;
  alias?: string;
  [key: string]: unknown;
}
