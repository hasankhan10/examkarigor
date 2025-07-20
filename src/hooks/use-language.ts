
'use client';

import { useSearchParams } from 'next/navigation';
import { translations, TranslationKeys, Language } from '@/lib/translations';

export const useLanguage = (subjectOverride?: string) => {
  const searchParams = useSearchParams();
  const subjectFromParams = searchParams.get('subject');
  
  const subject = subjectOverride || subjectFromParams;
  const lang: Language = subject === 'English' ? 'en' : 'bn';

  const t = (key: TranslationKeys, replacements?: Record<string, string | number>): string => {
    let translation = translations[lang][key] || translations['bn'][key]; // Fallback to Bengali
    
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`{{${placeholder}}}`, 'g');
            translation = translation.replace(regex, String(replacements[placeholder]));
        });
    }

    return translation;
  };

  return { t, lang };
};
