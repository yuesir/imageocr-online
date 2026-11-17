# Google 账号登录配置

本站沿用 Supabase Auth，使用 @supabase/ssr 的 PKCE 流程。Google 登录和邮箱登录共享 Supabase 用户体系；已有数据库新用户 trigger 会创建用户资料。不请求 Google API 权限、离线访问或 Google refresh token。

## 1. Google Cloud / Google Auth Platform

1. 创建或选择项目，配置 Branding、Audience 和 OAuth consent screen：应用名、支持邮箱、网站主页、隐私政策和服务条款；生产域名完成验证。
2. 创建 OAuth Client，类型选择 Web application。
3. Authorized JavaScript origins 配置正式站点 origin（例如 https://imageocr.ai）和需要的本地 origin（http://localhost:3000），不包含路径。
4. Authorized redirect URIs 填写 **Supabase Dashboard → Authentication → Sign In / Providers → Google 中显示的 Callback URL**：通常为 `https://<project-ref>.supabase.co/auth/v1/callback`。这里不是本站的 `/auth/callback`。
5. 仅使用基础身份范围 openid、email、profile。测试状态添加测试账号；正式开放时发布 consent screen，根据控制台要求完成验证。

## 2. Supabase Dashboard

1. Authentication → Providers → Google：启用，填入上一步的 Client ID 和 Client Secret。Secret 只保存在 Supabase，禁止加到 NEXT_PUBLIC_*、源码或浏览器。
2. 保持 nonce 校验开启，不启用 Skip Nonce Check。
3. Authentication → URL Configuration：Site URL 填写正式站点 origin。
4. Redirect URLs 添加精确回调地址：`https://<正式域名>/auth/callback`、`http://localhost:3000/auth/callback`。如需 www 或独立预发布域名，分别添加准确地址，生产避免宽泛通配符。
5. 沿用 Supabase 默认的已验证邮箱账号关联行为，无需自行按邮箱创建或合并用户。

## 3. 网站部署

配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`，二者必须属于上面同一个项目；重新构建部署。无需安装 NextAuth，无需在网站配置 Google Client Secret。

入口：`/login` 和 `/signup`。默认登录后进入首页 `/`；`/login?next=/pricing` 可返回本站指定页面。回调在服务端交换 code，并在同一 redirect response 写入会话 cookies。外部 next URL 和登录循环会回退到首页 `/`；失败只显示固定提示，不暴露 token 或提供方错误。

## 验收

### 登录失败排查

Supabase Users 中存在 Google 身份只表示身份已创建或关联，不代表网站完成了 code 换取会话。查看 Vercel 服务端 `[auth/callback]` 日志（不记录 code、token 或 Cookie 值）：

- `missing_supabase_configuration`：在 Production 配置上述两个环境变量并重新构建部署。浏览器客户端目前有备用配置，能发起授权不代表服务端环境变量齐全。
- `missing_authorization_code` / `provider_returned_error`：检查 Supabase Auth 日志和 Redirect URLs 配置。
- `session_exchange_failed`：根据 `errorCode` 和 `status` 排查；`hasCodeVerifier: false` 表示回调没有收到 PKCE 校验 Cookie，应检查浏览器是否允许 Cookie，以及入口和回调是否跨越了 www / 非 www 域名。
- `unexpected_exchange_failure`：检查服务端访问 Supabase 的网络和 URL 配置。

登录入口与回调应使用同一 origin；如配置了域名跳转，应在发起登录前完成统一，避免在 `/auth/callback` 上跳转到另一个域名丢失校验 Cookie。

- 无痕窗口点击 Continue with Google，选择测试账号后返回首页 `/`；刷新后仍登录，退出后会话清除。
- `/login?next=/pricing` 成功后进入套餐页；首次登录用户资料正常创建。
- 已有相同已验证邮箱用户登录后检查用户 ID、已有余额和历史记录保持一致。
- 取消授权、过期/重复回调 code、换浏览器打开回调：回到登录页显示可重试提示。
- `next=//example.com` 等外部地址不能跳出本站。
- 本地与正式域名分别验证，正式环境只使用 HTTPS。

本地检查：`npm run check`；`node --import tsx --test tests/auth.test.ts`。真实授权验收需要完成上述两个控制台的配置。

参考：[Supabase Google 登录](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)、[PKCE 流程](https://supabase.com/docs/guides/auth/sessions/pkce-flow)。
