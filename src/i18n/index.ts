export type Language = "en" | "zh";

const chinese: Record<string, string> = {
  "Works": "作品", "About": "关于", "CV": "简历", "Contact": "联系",
  "All works": "所有作品", "Selected works": "作品精选",
  "Year": "年份", "Materials": "材料", "Dimensions": "尺寸",
  "Next work": "下一件作品", "View all works": "查看全部作品",
  "Back to top": "返回顶部", "Menu": "菜单", "Close": "关闭",
  "Email": "邮箱", "Instagram": "Instagram", "Sculptor": "雕塑家",
  "The artist": "艺术家", "About the artist": "关于艺术家",
  "The artist / The practice": "艺术家 / 创作", "Artist statement": "艺术家自述",
  "CV & exhibitions": "简历与展览", "CV & Exhibitions": "简历与展览",
  "Curriculum vitae": "简历", "Sculpture / Archive": "雕塑 / 作品档案",
  "Project": "作品", "Explore the work": "查看作品", "Scroll to explore": "向下浏览",
  "Skip to content": "跳至正文", "Main navigation": "主导航",
  "Language": "语言", "Xiyu Wang home": "Xiyu Wang 首页",
  "(opens in a new tab)": "（在新标签页中打开）", "Get in touch": "联系",
  "Filter works by material": "按材料筛选作品", "Wood": "木", "Paper": "纸",
  "WOOD": "木雕", "METAL": "金属", "PAPER": "纸", "Metal": "金属",
  "Browse by material": "按材料浏览",
  "Mixed materials": "综合材料", "Upcoming": "即将到来",
  "RESIDENCIES": "驻留", "SOLO EXHIBITIONS": "个展",
  "SELECTED GROUP EXHIBITIONS": "群展精选", "EDUCATION": "教育经历",
  "PROFESSIONAL EXPERIENCE": "工作经历",
  "Enlarge": "放大图片", "image viewer": "图片查看器",
  "Close image viewer": "关闭图片查看器", "Previous image": "上一张图片",
  "Next image": "下一张图片", "Image to be added": "",
};

// Only interface labels are translated here, never artist copy or project facts.
export function translator(language: Language) {
  return (label: string): string => language === "zh" ? chinese[label] ?? label : label;
}

export function routePath(url: URL): string {
  const base = import.meta.env.BASE_URL;
  const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname.replace(/^\//, "");
  return path.replace(/^zh(?:\/|$)/, "").replace(/^\/+|\/+$/g, "");
}

export function getLanguage(url: URL): Language {
  const base = import.meta.env.BASE_URL;
  const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname.replace(/^\//, "");
  return /^zh(?:\/|$)/.test(path) ? "zh" : "en";
}

export function localizedHref(language: Language, path: string = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${import.meta.env.BASE_URL}${language === "zh" ? "zh/" : ""}${clean ? `${clean}/` : ""}`;
}
