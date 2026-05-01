import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: k => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('tzdalali:lang') as Lang) ?? 'en'
    } catch (e) {
      console.error('Failed to load language from localStorage', e)
      return 'en'
    }
  })

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem('tzdalali:lang', next)
    } catch (e) {
      console.error('Failed to save language to localStorage', e)
    }
  }

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = (translations[lang] as Record<string, string>)[key]
      ?? (translations.en as Record<string, string>)[key]
      ?? key
    if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)) })
    return str
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLanguage = () => useContext(LangContext)
