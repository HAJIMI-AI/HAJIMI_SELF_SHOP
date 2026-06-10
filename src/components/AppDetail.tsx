import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Fingerprint,
  Calendar,
  User,
  HardDrive,
  ExternalLink,
  Package,
  Copy,
  Check,
} from "lucide-react";
import InstallMethods from "@/components/InstallMethods";
import type { AppItem } from "@/types/app";
import { useLanguage } from "@/i18n/LanguageContext";
import { getCategoryKey } from "@/i18n/translations";

interface AppDetailProps {
  app: AppItem | null;
  open: boolean;
  onClose: () => void;
  installedInfo: { appVersion?: string; alias?: string } | null;
  onRefreshInstalled: () => Promise<void>;
}

export default function AppDetail({
  app,
  open,
  onClose,
  installedInfo,
  onRefreshInstalled,
}: AppDetailProps) {
  const { t } = useLanguage();
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [fingerprintCopied, setFingerprintCopied] = useState(false);

  const handleCopyFingerprint = useCallback(async () => {
    if (!app) return;
    try {
      await navigator.clipboard.writeText(app.fingerprint);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = app.fingerprint;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setFingerprintCopied(true);
    setTimeout(() => setFingerprintCopied(false), 2000);
  }, [app]);

  if (!app) return null;

  const catKey = getCategoryKey(app.category);
  const categoryLabel = catKey ? t(catKey) : app.category;
  const isInstalled = !!installedInfo;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col overflow-hidden p-0 gap-0">
        {/* Header — fixed */}
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <div className="flex items-start gap-4">
            <img
              src={app.icon}
              alt={app.name}
              className="size-16 rounded-2xl object-cover shrink-0 bg-muted"
            />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl">{app.name}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  v{app.version}
                </span>
                {isInstalled && (
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                  >
                    {t("installed")}
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs — fills remaining height, constrains scroll */}
        <Tabs defaultValue="details" className="flex flex-col flex-1 min-h-0">
          <div className="px-6 shrink-0">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                {t("details")}
              </TabsTrigger>
              <TabsTrigger value="install" className="flex-1">
                <Package className="size-4 mr-1.5" />
                {t("install")}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-6 pb-6">
              {/* ======== Details Tab ======== */}
              <TabsContent value="details" className="mt-4 space-y-6">
                {/* Screenshots */}
                {app.screenshots.length > 0 && (
                  <div>
                    <div className="rounded-xl overflow-hidden border bg-muted">
                      <img
                        src={app.screenshots[currentScreenshot]}
                        alt={`${app.name} screenshot ${currentScreenshot + 1}`}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                    {app.screenshots.length > 1 && (
                      <div className="flex gap-2 mt-2">
                        {app.screenshots.map((_s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentScreenshot(i)}
                            className={`size-2 rounded-full transition-colors ${
                              i === currentScreenshot
                                ? "bg-primary"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">{t("about")}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {app.fullDescription}
                  </p>
                </div>

                <Separator />

                {/* Metadata */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">{t("appInfo")}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{t("updated")}</span>
                      <span>{app.updateDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{t("author")}</span>
                      <span className="truncate">{app.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{t("size")}</span>
                      <span>{app.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{t("version")}</span>
                      <span>{app.version}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ======== Install Tab ======== */}
              <TabsContent value="install" className="mt-4 space-y-4">
                {/* Fingerprint */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                  <Fingerprint className="size-4 text-muted-foreground shrink-0" />
                  <code className="text-xs font-mono break-all flex-1 select-all">
                    {app.fingerprint}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyFingerprint}
                    className="shrink-0 gap-1.5 h-8"
                  >
                    {fingerprintCopied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {fingerprintCopied ? t("copied") : t("copyFingerprint")}
                  </Button>
                </div>

                {/* Remote URL if available */}
                {app.remoteUrl && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                    <ExternalLink className="size-4 text-muted-foreground shrink-0" />
                    <code className="text-xs font-mono break-all flex-1 select-all">
                      {app.remoteUrl}
                    </code>
                  </div>
                )}

                <Separator />

                {/* Install methods */}
                <InstallMethods
                  app={app}
                  installedInfo={installedInfo}
                  onRefreshInstalled={onRefreshInstalled}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
