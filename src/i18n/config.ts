import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEn from './locales/en/common.json'
import dashboardEn from './locales/en/dashboard.json'
import productsEn from './locales/en/products.json'
import equipmentEn from './locales/en/equipment.json'
import samplesEn from './locales/en/samples.json'
import researchersEn from './locales/en/researchers.json'
import routinesEn from './locales/en/routines.json'

import commonPt from './locales/pt-BR/common.json'
import dashboardPt from './locales/pt-BR/dashboard.json'
import productsPt from './locales/pt-BR/products.json'
import equipmentPt from './locales/pt-BR/equipment.json'
import samplesPt from './locales/pt-BR/samples.json'
import researchersPt from './locales/pt-BR/researchers.json'
import routinesPt from './locales/pt-BR/routines.json'

export const defaultNS = 'common'
export const resources = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    products: productsEn,
    equipment: equipmentEn,
    samples: samplesEn,
    researchers: researchersEn,
    routines: routinesEn,
  },
  'pt-BR': {
    common: commonPt,
    dashboard: dashboardPt,
    products: productsPt,
    equipment: equipmentPt,
    samples: samplesPt,
    researchers: researchersPt,
    routines: routinesPt,
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
