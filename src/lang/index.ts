import * as de from './translations/de.json';
import * as en from './translations/en.json';
import * as es from './translations/es.json';
import * as fr from './translations/fr.json';
import * as nl from './translations/nl.json';

const translations = {
  de: de as any,
  en: en as any,
  es: es as any,
  fr: fr as any,
  nl: nl as any,
};

/**
 *
 *
 * @param {string} key key which you'd like to translate.
 * @param {'en' | 'nl' | 'de' | 'fr' | 'es'} lang language you'd like to translate to.
 * @returns translated string
 */
export const getStringFor = (key: string, lang: string) => {
  if (Object.keys(translations).indexOf(lang) < 0) {
    throw new Error(`Language '${lang}' does not exist in translations.`);
  }
  if (!translations[lang][key]) {
    throw new Error(`Key '${key}' does not exist on language '${lang}'`);
  }
  return translations[lang][key];
};
