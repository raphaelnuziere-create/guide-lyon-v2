'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@guide-de-lyon/ui';
import { locales, type Locale } from '../i18n';

const languageNames = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
} as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('common');

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie for language persistence
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    
    // Remove current locale from pathname
    const segments = pathname.split('/');
    const isCurrentLocaleInPath = locales.includes(segments[1] as Locale);
    
    let newPathname;
    if (isCurrentLocaleInPath) {
      // Replace current locale
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add new locale (current is default)
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-32" aria-label={t('language')}>
        <SelectValue placeholder={languageNames[locale]} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {languageNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}