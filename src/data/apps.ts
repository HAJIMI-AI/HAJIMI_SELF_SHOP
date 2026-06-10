import { useState, useEffect, useMemo } from "react";
import type { AppItem } from "@/types/app";
import { getInstalledApps } from "@/lib/eventCenter";

interface UseAppsResult {
  apps: AppItem[];
  loading: boolean;
  error: string | null;
}

const APPS_URL =
  "https://raw.githubusercontent.com/HAJIMI-AI/SHOP_APPS/main/apps.json";

let appsCache: Promise<AppItem[]> | null = null;

function fetchApps(): Promise<AppItem[]> {
  if (!appsCache) {
    const url = `${APPS_URL}?_t=${Date.now()}`;
    appsCache = fetch(url).then(async (res) => {
      if (!res.ok)
        throw new Error(`Failed to load apps: ${res.status}`);

      return res.json();
    });
  }
  return appsCache;
}

export function useApps(): UseAppsResult {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchApps()
      .then((data) => {
        if (!cancelled) {
          setApps(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load apps");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { apps, loading, error };
}

export interface InstalledAppInfo {
  appId: string;
  appVersion?: string;
  alias?: string;
}

interface UseInstalledAppsResult {
  installedApps: InstalledAppInfo[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useInstalledApps(): UseInstalledAppsResult {
  const [installedApps, setInstalledApps] = useState<InstalledAppInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInstalled = async () => {
    try {
      const apps = await getInstalledApps();
      setInstalledApps(
        apps.map((a) => ({
          appId: a.appId,
          appVersion: a.appVersion,
          alias: a.alias,
        }))
      );
    } catch {
      // Silently fail — eventCenter may not be available
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadInstalled();
      if (!cancelled) setLoading(false);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    await loadInstalled();
    setLoading(false);
  };

  return { installedApps, loading, refresh };
}

export function useFilteredApps(
  apps: AppItem[],
  searchQuery: string,
  category: string | null
): AppItem[] {
  return useMemo(() => {
    let filtered = apps;

    if (category && category !== "All") {
      filtered = filtered.filter((app) => app.category === category);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.author.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [apps, searchQuery, category]);
}
