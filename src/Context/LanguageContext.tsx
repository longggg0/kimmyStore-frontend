import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../translations';
import type { TranslationKey } from '../translations';

type Language = 'en' | 'km';

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggle = () => setLanguage(prev => prev === 'en' ? 'km' : 'en');

  const t = (key: TranslationKey): string =>
    translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}