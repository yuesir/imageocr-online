# Google Analytics 集成配置指南

本项目已集成 Google Analytics 4 (GA4) 用于网站分析和用户行为跟踪。本指南将帮助您完成配置和使用。

## 🚀 快速开始

### 1. 获取 Google Analytics 测量 ID

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 登录您的 Google 账户
3. 创建新的 GA4 属性或选择现有属性
4. 进入 **管理** → **数据流** → **网站**
5. 选择您的网站数据流
6. 复制 **测量 ID**（格式：`G-XXXXXXXXXX`）

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **重要**：请将 `G-XXXXXXXXXX` 替换为您实际的测量 ID

### 3. 部署验证

部署到生产环境后，您可以通过以下方式验证 GA 是否正常工作：

1. 打开浏览器开发者工具
2. 访问您的网站
3. 在 Network 标签页中查找 `google-analytics.com` 的请求
4. 或在 Console 中查看调试信息

## 📊 功能特性

### 自动页面跟踪
- ✅ 自动跟踪所有页面浏览量
- ✅ 支持 Next.js 客户端路由
- ✅ 记录页面标题、路径和完整 URL

### 隐私合规
- ✅ GDPR 兼容的 Cookie 同意机制
- ✅ 默认拒绝所有 cookies，等待用户同意
- ✅ 用户可以随时更改同意设置
- ✅ 不收集个人身份信息

### 性能优化
- ✅ 延迟加载，不阻塞页面渲染
- ✅ 仅在生产环境启用
- ✅ 智能错误处理和降级

### OCR 特定事件跟踪
- ✅ OCR 处理开始/完成/错误事件
- ✅ 图片上传统计
- ✅ 处理时间分析
- ✅ 错误类型分类

## 🛠️ 高级用法

### 自定义事件跟踪

```typescript
import { trackEvent, ocrEvents } from '@/lib/analytics'

// 基础事件跟踪
trackEvent({
  action: 'button_click',
  category: 'UI',
  label: 'header_cta',
  value: 1
})

// OCR 特定事件
ocrEvents.startOCR('business_card')
ocrEvents.completeOCR('business_card', 1500) // 1.5秒
ocrEvents.errorOCR('business_card', 'invalid_format')
```

### 用户属性设置

```typescript
import { setUserProperties } from '@/lib/analytics'

setUserProperties({
  user_type: 'premium',
  preferred_language: 'zh-CN',
  ocr_usage_level: 'high'
})
```

### Cookie 同意管理

```typescript
import { getCookieConsent, resetCookieConsent } from '@/lib/cookie-consent'

// 检查同意状态
const consent = getCookieConsent() // 'accepted' | 'declined' | null

// 重置同意状态（用于设置页面）
resetCookieConsent()
```

## 🔧 配置选项

### 环境变量

| 变量名 | 描述 | 必需 | 默认值 |
|--------|------|------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 测量 ID | 是 | - |
| `NODE_ENV` | 环境模式 | 否 | development |

### 行为配置

- **生产环境检查**：GA 仅在 `NODE_ENV=production` 时启用
- **同意等待时间**：Cookie 同意对话框延迟 2 秒显示
- **数据保留**：遵循 GA4 默认数据保留政策

## 🔍 调试和故障排除

### 开发环境调试

在开发环境中，GA 不会实际发送数据，但会在控制台输出调试信息：

```javascript
// 在浏览器控制台中查看
console.debug('GA not loaded or not enabled, skipping event:', event)
```

### 常见问题

**Q: GA 数据没有显示？**
A: 检查以下项目：
- 测量 ID 是否正确设置
- 是否在生产环境
- 用户是否同意了 cookies
- 网络请求是否被广告拦截器阻止

**Q: Cookie 同意对话框不显示？**
A: 检查：
- 浏览器本地存储中是否已有 `cookie-consent` 记录
- 清除浏览器缓存和本地存储

**Q: 页面跟踪不准确？**
A: 确保：
- `PageTrackingProvider` 正确包装了应用
- Next.js 路由正常工作
- 没有 JavaScript 错误阻止执行

## 📈 数据分析建议

### 关键指标
- **页面浏览量**：了解最受欢迎的 OCR 功能
- **用户流**：分析用户在不同 OCR 类型间的转换
- **事件跟踪**：监控 OCR 成功率和错误类型
- **性能指标**：跟踪 OCR 处理时间

### 自定义报告
建议在 GA4 中创建以下自定义报告：
- OCR 使用情况分析
- 错误率趋势
- 用户参与度分析
- 移动端 vs 桌面端使用对比

## 🔒 隐私和合规

### GDPR 合规
- ✅ 明确的同意机制
- ✅ 数据处理透明度
- ✅ 用户控制权（可随时撤回同意）
- ✅ 数据最小化原则

### 数据安全
- 所有数据传输使用 HTTPS
- 不收集敏感个人信息
- 遵循 Google Analytics 数据处理协议

## 📚 相关资源

- [Google Analytics 4 文档](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Third Parties 文档](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [GDPR 合规指南](https://gdpr.eu/)
- [Cookie 同意最佳实践](https://developers.google.com/analytics/devguides/collection/ga4/consent)

---

如有问题或需要帮助，请查看项目文档或联系开发团队。