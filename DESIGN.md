# ImageOCRAI 公共设计规范

参考：`imageocrai_archival_editorial_optical_workbench.html` 与提供的截图。参考文件作为视觉素材；产品功能、数据处理及安全承诺应以实际实现为准。

## 设计方向

Archival Editorial / Optical Workbench：用档案纸张的温度与精密工具的秩序组织页面。衬线标题、低饱和纸色、细边框、等宽技术标签形成统一视觉语言。页面不使用大面积彩色渐变、悬浮厚阴影或装饰性彩虹图标。

## 公共设计变量

| 角色 | 浅色值 | 用法 |
| --- | --- | --- |
| Paper / background | `#F6F4EF` | 页面背景 |
| Card | `#FCFBF9` | 卡片、表单、弹层 |
| Recessed / secondary | `#EFECE6` | 工具栏、技术标签、次级区域 |
| Ink / foreground | `#141413` | 正文、重要标题 |
| Muted ink | `#575652` | 次级正文 |
| Subtle ink | `#84827B` | 辅助标记；小字需保证对比度 |
| Hairline | `#E2DDD3` | 分隔线、卡片边框 |
| Strong line | `#C9C2B4` | 输入框和标尺 |
| Vermilion / primary | `#D94E28` | 主操作、强调文字、栏目标签 |
| Vermilion hover | `#BE3F1D` | 主操作悬停参考 |
| Sage | `#2A6F4E` | 成功状态 |

实现以 `app/globals.css` 的 HSL 语义变量为准，Tailwind 使用 `bg-background`、`bg-card`、`text-foreground`、`text-muted-foreground`、`border-border`、`bg-primary`。深色模式通过 `.dark` 重定义纸张、墨色及边框，保留朱红品牌色。禁止新页面另设一套主题配色。

## 字体与层级

- 标题：Newsreader，Georgia 回退，常规字重，紧凑字距；标题重点词可使用朱红斜体。
- UI 和正文：Plus Jakarta Sans，系统无衬线回退；正文行高约 1.7。
- 技术标签、步骤、格式、状态：JetBrains Mono，等宽字体回退，10–12px，大写英文标签加字距。
- 首屏标题：移动端约 36px、桌面端约 60px；栏目标题 30–36px；卡片标题 24px；正文 14–16px。
- 不将长正文或主按钮全部设为大写。保持页面原有语种与实际业务含义。

## 布局与节奏

内容宽度约 1180–1280px，居中，移动端左右留白 20px。栏目上下间距桌面端 80px、移动端 48px，使用细线划分区域。桌面端采用两列首屏、三列工具/步骤卡片；窄屏自然堆叠，不固定页面高度。法律文档和文章采用较窄阅读列。

首页顺序：品牌导航 → 编辑式标题和说明 → 实际 OCR 工作台 → 提取工具索引 → 操作步骤 → 产品说明 → FAQ → 深色 CTA → 页脚。其他工具页保留工具专属说明与实际功能，复用相同排版、纸色和控件。

## 组件约定

- `.eyebrow`：朱红栏目标签，置于栏目标题之前。
- `.editorial-section`、`.editorial-wrap`：公共栏目留白及内容容器。
- `.editorial-card`：纸白背景、1px 描边、10px 圆角、向下 2px 的轻实体阴影。
- `HomeHero`（`components/home/HomeHero.tsx`）：首页采用左侧编辑式标题与说明、右侧票据到文字的示例；示例明确标注，复制操作可用。真实 OCR 工作台放在下方；装饰仅用低饱和语义色和轻实体阴影。
- `ToolHero`（`components/ocr/ToolHero.tsx`）：工具页公共首屏，复用纸色、衬线标题和朱红技术标签；桌面双栏、手机堆叠。标题与说明使用语义前景色，不继承白色文字；图标只作为小型栏目标记。
- `.optical-workbench`：有边界的工具容器，上方显示等宽工具标识，下方使用真实上传、预览和结果组件。
- `Balance`：识别工作台顶部使用紧凑额度提示条，显示余额、UTC 重置时间和右侧购买入口。详细计费及并发规则通过信息按钮展开，不常驻大段说明。
- `.workbench-label`：辅助技术信息，不承载关键操作说明。
- `.ruler`：稀疏标尺刻度，用于工作台与内容区之间，不干扰交互。
- Button、Card、Input、Tabs、Badge 等公共 UI 使用语义 token；主操作朱红，次级操作纸色或描边。保留 loading、disabled、错误与成功状态。
- FAQ 统一使用 `components/faq/FAQSection.tsx`，包括首页、工具页和定价页。使用相同的居中阅读宽度、圆角描边、纸色 hover、单项展开和内缩焦点框；问答支持段落、列表与链接，不再单独手写折叠状态或 FAQ 卡片。
- 深墨色强调区配纸白文字；不要在浅纸色上使用白色正文。

## 可访问性与响应式

保持可见的键盘焦点、输入标签、可读对比度及真实链接目标。操作不要仅依赖颜色。移动端导航和操作允许换行或收纳；上传及结果区不得出现横向溢出。尊重 `prefers-reduced-motion`。主题切换继续可用，新用户默认浅色纸张主题。

## 内容与维护

适用于所有公开页面、OCR 工具、博客和文章、登录注册、账户偏好、仪表盘、定价及政策页面。保留原有认证、计费、OCR、搜索及导出逻辑。不得把参考稿中的准确率、延迟、评价、零留存和合规声明直接视为已验证事实。新增页面优先复用公共组件，避免硬编码原有蓝紫配色。

验证：运行 `npm run check` 和 `npm run build`，并检查首页、工具页、表单、定价、博客与政策页在宽屏和窄屏下的布局与主题。
