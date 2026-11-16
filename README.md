# ImageOCR Online - Next.js OCR Application

A modern web application for extracting text from images using OCR technology. Built with Next.js 15, React 18, TypeScript, and Supabase.

## Features

- **Image Upload**: Drag & drop or click to upload JPG, PNG, PDF files
- **OCR Processing**: Extract text from images using Tesseract.js
- **User Authentication**: Sign up, login, and user management with Supabase
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **OCR History**: View and manage your OCR processing history

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **OCR Engine**: Tesseract.js
- **UI Components**: Radix UI, Lucide React
- **Styling**: Tailwind CSS with custom themes

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## One-time image packs

Starter: $5.99 / 100 images; Plus (Recommended): $9.99 / 300; Max: $19.99 / 800. Purchased images never expire. Guests receive 2 free images/day and signed-in accounts 4/day total, resetting at 00:00 UTC.

Apply the billing migration before deploying the new OCR handlers. Purchases remain disabled until `BILLING_ENABLED=true`. See [billing setup, tests and cost gate](docs/billing.md) for Waffo configuration and launch requirements. Run `npm run test:billing` for isolated PostgreSQL and API contract tests.

## Google 账号登录

登录页和注册页支持通过 Supabase Auth 使用 Google 账号登录（PKCE）。部署前按 [配置指南](docs/google-login.md) 设置 Google Cloud 和 Supabase 回调地址及凭据。
