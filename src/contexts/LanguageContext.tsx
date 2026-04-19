import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  toggle: () => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangCtx>({ lang: 'en', toggle: () => {}, t: k => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem('tzdalali:lang') as Lang) ?? 'en' } catch { return 'en' }
  })

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'zh' : 'en'
    setLang(next)
    try { localStorage.setItem('tzdalali:lang', next) } catch {}
  }

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let str = (translations[lang] as Record<string, string>)[key]
      ?? (translations.en as Record<string, string>)[key]
      ?? key
    if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)) })
    return str
  }

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>
}

export const useLanguage = () => useContext(LangContext)
