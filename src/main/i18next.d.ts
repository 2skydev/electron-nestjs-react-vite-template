import 'i18next'
import defaultLocale from 'resources/locales/ko_KR.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof defaultLocale
    }
  }
}
