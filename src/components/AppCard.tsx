import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppItem } from "@/types/app";
import { useLanguage } from "@/i18n/LanguageContext";
import { getCategoryKey } from "@/i18n/translations";

interface AppCardProps {
  app: AppItem;
  isInstalled: boolean;
  onClick: (app: AppItem) => void;
}

export default function AppCard({ app, isInstalled, onClick }: AppCardProps) {
  const { t } = useLanguage();
  const catKey = getCategoryKey(app.category);
  const categoryLabel = catKey ? t(catKey) : app.category;

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
      onClick={() => onClick(app)}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <img
          src={app.icon}
          alt={app.name}
          className="size-12 rounded-xl object-cover shrink-0 bg-muted"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-base">{app.name}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-sm leading-relaxed">
            {app.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs font-medium">
          {categoryLabel}
        </Badge>
        <span className="text-xs text-muted-foreground">
          v{app.version}
        </span>
        {isInstalled && (
          <Badge
            variant="outline"
            className="ml-auto text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
          >
            {t("installed")}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
