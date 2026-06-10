import { useState, useMemo } from "react";
import { PackageOpen, Languages } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import AppCard from "@/components/AppCard";
import AppDetail from "@/components/AppDetail";
import { useApps, useInstalledApps, useFilteredApps } from "@/data/apps";
import type { AppItem, AppCategory } from "@/types/app";
import { getAppContext } from "@/lib/eventCenter";
import { useLanguage } from "@/i18n/LanguageContext";

const CATEGORIES: Array<"All" | AppCategory> = [
  "All",
  "Productivity",
  "Developer Tools",
  "Utilities",
  "Design",
  "Entertainment",
  "Education",
];

const CATEGORY_TKEYS: Record<string, string> = {
  All: "categoryAll",
  Productivity: "categoryProductivity",
  "Developer Tools": "categoryDeveloperTools",
  Utilities: "categoryUtilities",
  Design: "categoryDesign",
  Entertainment: "categoryEntertainment",
  Education: "categoryEducation",
};

export default function AppStore() {
  const { t, toggleLanguage } = useLanguage();
  const { apps, loading, error } = useApps();
  const { installedApps, refresh: refreshInstalled } = useInstalledApps();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | AppCategory
  >("All");
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const context = getAppContext();
  const filteredApps = useFilteredApps(
    apps,
    searchQuery,
    selectedCategory === "All" ? null : selectedCategory
  );

  const installedAppIds = useMemo(
    () => new Set(installedApps.map((a) => a.appId)),
    [installedApps]
  );

  const installedAppMap = useMemo(() => {
    const map = new Map<string, { appVersion?: string; alias?: string }>();
    for (const a of installedApps) {
      map.set(a.appId, { appVersion: a.appVersion, alias: a.alias });
    }
    return map;
  }, [installedApps]);

  const selectedInstalledInfo = selectedApp
    ? installedAppMap.get(selectedApp.id) ?? null
    : null;

  const handleAppClick = (app: AppItem) => {
    setSelectedApp(app);
    setDialogOpen(true);
  };

  const curCatLabel =
    CATEGORY_TKEYS[selectedCategory] ?? CATEGORY_TKEYS["All"];
  const currentCategoryLabel = t(curCatLabel);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PackageOpen className="size-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {t("appStoreTitle")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("appStoreSubtitle")}
                  </p>
                </div>
              </div>
              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                title={t("switchLangLabel")}
              >
                <Languages className="size-4" />
                <span className="text-xs font-medium">{t("switchLang")}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const label = t(CATEGORY_TKEYS[cat] ?? cat);
                return (
                  <Badge
                    key={cat}
                    variant={
                      selectedCategory === cat ? "default" : "outline"
                    }
                    className="cursor-pointer transition-colors hover:bg-primary/10"
                    onClick={() => setSelectedCategory(cat)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedCategory(cat);
                      }
                    }}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("searchPlaceholder")}
            />
          </div>

          {/* Installed count */}
          {context !== "browser" && installedApps.length > 0 && (
            <p className="text-xs text-muted-foreground mb-4">
              {t("appsInstalled", { count: installedApps.length })}
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-5 border rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <PackageOpen className="size-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {t("failedToLoad")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => window.location.reload()}
              >
                {t("tryAgain")}
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredApps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <PackageOpen className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{t("noAppsFound")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery.trim()
                    ? t("noSearchResults", { query: searchQuery })
                    : t("noAppsInCategory")}
                </p>
              </div>
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>
          )}

          {/* App Grid */}
          {!loading && !error && filteredApps.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {t("appCountLabel", {
                  count: filteredApps.length,
                  plural: filteredApps.length !== 1 ? "s" : "",
                  category:
                    selectedCategory !== "All"
                      ? t("inCategory", { category: currentCategoryLabel })
                      : "",
                  query: searchQuery.trim()
                    ? t("matching", { query: searchQuery })
                    : "",
                })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    isInstalled={installedAppIds.has(app.id)}
                    onClick={handleAppClick}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Detail Dialog */}
        <AppDetail
          app={selectedApp}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          installedInfo={selectedInstalledInfo}
          onRefreshInstalled={refreshInstalled}
        />
      </div>
    </TooltipProvider>
  );
}
