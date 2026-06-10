import type { AppContext, InstalledApp } from "@/types/app";

// Use a local type derived from the global window.eventCenter
type EventCenterAPI = NonNullable<typeof window.eventCenter>;

function getEventCenter(): EventCenterAPI | null {
  if (typeof window !== "undefined" && window.eventCenter) {
    return window.eventCenter;
  }
  return null;
}

export function getAppContext(): AppContext {
  const ec = getEventCenter();
  if (!ec) return "browser";
  try {
    const appId = ec.getAppId();
    return appId === null ? "main" : "subapp";
  } catch {
    return "browser";
  }
}

export async function installLocal(
  alias: string,
  directory: string
): Promise<void> {
  const ec = getEventCenter();
  if (!ec) {
    console.warn(
      "[AppStore] eventCenter not available. In Electron, this opens a file picker to select the app directory."
    );
    return;
  }
  await ec.invoke("apps", "create", [{ alias, directory }]);
}

export async function installByFingerprint(
  fingerprint: string,
  alias: string,
  overwrite = false
): Promise<void> {
  const ec = getEventCenter();
  if (!ec) throw new Error("eventCenter not available");
  await ec.importByFingerprint({ fingerprint, alias, overwrite });
}

export async function installByUrl(
  url: string,
  alias: string
): Promise<void> {
  const ec = getEventCenter();
  if (!ec) throw new Error("eventCenter not available");
  await ec.importByUrl({ url, alias });
}

export async function refreshApps(): Promise<void> {
  const ec = getEventCenter();
  if (!ec) throw new Error("eventCenter not available");
  await ec.refreshApps();
}

export async function refreshMainAppList(): Promise<void> {
  const ec = getEventCenter();
  if (!ec) throw new Error("eventCenter not available");
  await ec.refreshMainAppList();
}

export async function getInstalledApps(): Promise<InstalledApp[]> {
  const ec = getEventCenter();
  if (!ec) return [];
  try {
    const { apps } = await ec.listApps({ reload: true });
    return apps.map((a) => ({
      appId: a.hsq.appId,
      appName: a.hsq.appName,
      appVersion: a.hsq.appVersion,
      alias: a.alias,
    }));
  } catch {
    return [];
  }
}
