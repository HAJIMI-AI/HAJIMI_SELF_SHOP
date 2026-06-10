import { useState, useEffect } from "react";
import { Download, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AppItem, InstallStatus } from "@/types/app";
import { getAppContext, installByFingerprint, refreshApps, refreshMainAppList } from "@/lib/eventCenter";
import { useLanguage } from "@/i18n/LanguageContext";

interface InstallMethodsProps {
  app: AppItem;
  installedInfo?: { appVersion?: string; alias?: string } | null;
  onRefreshInstalled?: () => Promise<void>;
}

const CDN_BASE =
  "https://raw.githubusercontent.com/HAJIMI-AI/SHOP_APPS/main/apps";

export default function InstallMethods({ app, installedInfo, onRefreshInstalled }: InstallMethodsProps) {
  const { t } = useLanguage();
  const context = getAppContext();
  const isElectron = context !== "browser";

  const [installStatus, setInstallStatus] = useState<InstallStatus>("idle");
  const [installError, setInstallError] = useState<string | undefined>();

  // Version comparison
  const installedVersion = installedInfo?.appVersion;
  const installedAlias = installedInfo?.alias;
  const isInstalled = !!installedInfo;
  const isSameVersion = isInstalled && installedVersion === app.version;
  const isDifferentVersion = isInstalled && installedVersion !== app.version;

  // Reset status when app changes
  useEffect(() => {
    setInstallStatus("idle");
    setInstallError(undefined);
  }, [app.id]);

  const doInstall = async (alias: string, overwrite = false) => {
    setInstallStatus("installing");
    setInstallError(undefined);
    try {
      await installByFingerprint(app.fingerprint, alias, overwrite);
      setInstallStatus("success");
      // 1) Force host to re-read local hsq.config.json and register the app
      await refreshApps();
      // 2) Notify main window to refresh its app list
      await refreshMainAppList();
      // 3) Refresh installed app list so parent picks up the new version
      await onRefreshInstalled?.();
    } catch (err) {
      setInstallStatus("error");
      setInstallError(
        err instanceof Error ? err.message : t("fingerprintInstallFailed")
      );
    }
  };

  const handleInstall = () => doInstall(app.name);
  const handleUpdate = () => doInstall(installedAlias || app.name, true);

  const handleDownloadZip = () => {
    const zipUrl = `${CDN_BASE}/${app.fingerprint}.zip`;
    window.open(zipUrl, "_blank");
  };

  // ── Electron mode ──
  if (isElectron) {
    const StatusIcon =
      installStatus === "success"
        ? CheckCircle2
        : installStatus === "installing"
          ? Loader2
          : installStatus === "error"
            ? AlertCircle
            : null;

    // Already installed, same version — show badge
    if (isSameVersion) {
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium">{t("installedSuccess")}</p>
          <p className="text-xs text-muted-foreground">
            v{installedVersion}
          </p>
        </div>
      );
    }

    // Installed but different version — update button
    if (isDifferentVersion) {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              v{installedVersion}
            </Badge>
            <span>→</span>
            <Badge variant="default" className="text-xs">
              v{app.version}
            </Badge>
          </div>
          <Button
            size="lg"
            className="w-full gap-2"
            disabled={installStatus === "installing" || installStatus === "success"}
            onClick={handleUpdate}
          >
            {StatusIcon && (
              <StatusIcon className={`size-4 ${installStatus === "installing" ? "animate-spin" : ""}`} />
            )}
            {installStatus === "installing"
              ? t("installing")
              : installStatus === "success"
                ? t("installedSuccess")
                : installStatus === "error"
                  ? installError ?? t("installFailed")
                  : (
                    <>
                      <RefreshCw className="size-4" />
                      {t("updateApp")}
                    </>
                  )}
          </Button>
          {installStatus === "error" && (
            <p className="text-xs text-destructive text-center">{installError}</p>
          )}
        </div>
      );
    }

    // Not installed — install button
    return (
      <div className="flex flex-col gap-4">
        <Button
          size="lg"
          className="w-full"
          disabled={installStatus === "installing" || installStatus === "success"}
          onClick={handleInstall}
        >
          {StatusIcon && (
            <StatusIcon className={`size-4 ${installStatus === "installing" ? "animate-spin" : ""}`} />
          )}
          {installStatus === "installing"
            ? t("installing")
            : installStatus === "success"
              ? t("installedSuccess")
              : installStatus === "error"
                ? installError ?? t("installFailed")
                : t("installApp")}
        </Button>
        {installStatus === "error" && (
          <p className="text-xs text-destructive text-center">{installError}</p>
        )}
      </div>
    );
  }

  // ── Browser mode: download ZIP ──
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleDownloadZip}
      >
        <Download className="size-4" />
        {t("downloadZip")}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        {t("downloadZipBrowserDesc")}
      </p>
    </div>
  );
}
