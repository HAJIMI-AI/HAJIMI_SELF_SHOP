export type Language = "zh" | "en";

export const translations = {
  // ============ AppStore ============
  appStoreTitle: { zh: "应用商店", en: "App Store" },
  appStoreSubtitle: { zh: "发现并安装适用于工作空间的应用", en: "Discover and install apps for your workspace" },
  categoryAll: { zh: "全部", en: "All" },
  categoryProductivity: { zh: "效率工具", en: "Productivity" },
  categoryDeveloperTools: { zh: "开发者工具", en: "Developer Tools" },
  categoryUtilities: { zh: "实用工具", en: "Utilities" },
  categoryDesign: { zh: "设计", en: "Design" },
  categoryEntertainment: { zh: "娱乐", en: "Entertainment" },
  categoryEducation: { zh: "教育", en: "Education" },
  runningInMainApp: { zh: "运行在主应用中", en: "Running in main app" },
  runningInSubApp: { zh: "运行在子应用中", en: "Running in sub-app" },
  appsInstalled: { zh: "已安装 {count} 个应用", en: "{count} app(s) installed" },
  failedToLoad: { zh: "加载应用失败", en: "Failed to load apps" },
  tryAgain: { zh: "重试", en: "Try again" },
  noAppsFound: { zh: "未找到应用", en: "No apps found" },
  noSearchResults: { zh: '未找到 "{query}" 的搜索结果，请尝试其他关键词。', en: 'No results for "{query}". Try a different search term.' },
  noAppsInCategory: { zh: "该分类下暂无应用。", en: "No apps available in this category." },
  clearFilters: { zh: "清除筛选", en: "Clear filters" },
  appCountLabel: {
    zh: "{count} 个应用{category}{query}",
    en: "{count} app{plural}{category}{query}",
  },
  inCategory: { zh: "，分类：{category}", en: " in {category}" },
  matching: { zh: '，匹配："{query}"', en: ' matching "{query}"' },

  // ============ AppCard ============
  installed: { zh: "已安装", en: "Installed" },

  // ============ AppDetail ============
  details: { zh: "详情", en: "Details" },
  install: { zh: "安装", en: "Install" },
  about: { zh: "关于", en: "About" },
  appInfo: { zh: "应用信息", en: "App Info" },
  updated: { zh: "更新时间：", en: "Updated:" },
  author: { zh: "作者：", en: "Author:" },
  size: { zh: "大小：", en: "Size:" },
  version: { zh: "版本：", en: "Version:" },
  appFingerprint: { zh: "应用指纹", en: "App Fingerprint" },
  fingerprintDesc: {
    zh: "使用此指纹通过指纹方式安装应用。它在 CDN 上唯一标识此应用。",
    en: "Use this fingerprint to install the app via the fingerprint method. It uniquely identifies this app on the CDN.",
  },
  remoteUrl: { zh: "远程地址", en: "Remote URL" },
  remoteUrlDesc: {
    zh: "该应用可通过此 URL 远程安装和加载（需要该端点存在 hsq.config.json）。",
    en: "The app can be installed and loaded remotely from this URL (requires hsq.config.json at this endpoint).",
  },

  // ============ InstallMethods ============
  installing: { zh: "安装中...", en: "Installing..." },
  installedSuccess: { zh: "已安装！", en: "Installed!" },
  failed: { zh: "失败", en: "Failed" },
  installApp: { zh: "安装应用", en: "Install App" },
  updateApp: { zh: "更新应用", en: "Update App" },
  fingerprintLabel: { zh: "应用指纹", en: "Fingerprint" },
  copyFingerprint: { zh: "复制指纹", en: "Copy" },
  copied: { zh: "已复制", en: "Copied" },
  downloadZip: { zh: "下载 ZIP", en: "Download ZIP" },
  downloadZipBrowserDesc: {
    zh: "下载 ZIP 包后解压，通过主应用的本地安装功能完成导入。",
    en: "Download the ZIP file, extract it, then use the main app's local install to import.",
  },

  // ============ SearchBar ============
  searchPlaceholder: { zh: "搜索应用...", en: "Search apps..." },

  // ============ Errors ============
  installFailed: { zh: "安装失败", en: "Install failed" },
  fingerprintInstallFailed: { zh: "指纹安装失败", en: "Fingerprint install failed" },
  urlInstallFailed: { zh: "URL 安装失败", en: "URL install failed" },

  // ============ Language Switcher ============
  switchLang: { zh: "English", en: "中文" },
  switchLangLabel: { zh: "切换到英文", en: "切换到中文" },
} as const;

export type TranslationKey = keyof typeof translations;

export function getCategoryKey(category: string): TranslationKey | null {
  const map: Record<string, TranslationKey> = {
    All: "categoryAll",
    Productivity: "categoryProductivity",
    "Developer Tools": "categoryDeveloperTools",
    Utilities: "categoryUtilities",
    Design: "categoryDesign",
    Entertainment: "categoryEntertainment",
    Education: "categoryEducation",
  };
  return map[category] ?? null;
}
