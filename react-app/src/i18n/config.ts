import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEn from './locales/en/common.json'
import dashboardEn from './locales/en/dashboard.json'
import productsEn from './locales/en/products.json'
import equipmentEn from './locales/en/equipment.json'

import commonPt from './locales/pt-BR/common.json'
import dashboardPt from './locales/pt-BR/dashboard.json'
import productsPt from './locales/pt-BR/products.json'
import equipmentPt from './locales/pt-BR/equipment.json'

export const defaultNS = 'common'
export const resources = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    products: productsEn,
    equipment: equipmentEn,
  },
  'pt-BR': {
    common: commonPt,
    dashboard: dashboardPt,
    products: productsPt,
    equipment: equipmentPt,
  },
} as const

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
