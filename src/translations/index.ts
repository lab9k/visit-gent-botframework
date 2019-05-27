import * as de from './translation_lists/de.json';
import * as en from './translation_lists/en.json';
import * as es from './translation_lists/es.json';
import * as fr from './translation_lists/fr.json';
import * as nl from './translation_lists/nl.json';

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
export default {
  getStringFor(key: string, lang: string): string {
    if (Object.keys(translations).indexOf(lang) < 0) {
      throw new Error(`Language '${lang}' does not exist in translations.`);
    }
    if (!translations[lang][key]) {
      throw new Error(`Key '${key}' does not exist on language '${lang}'`);
    }
    return translations[lang][key];
  },
  SET_LANGUAGE: 'SET_LANGUAGE',
  WHAT_TYPE_TO_SEE: 'WHAT_TYPE_TO_SEE',
  USE_BUTTONS: 'USE_BUTTONS',
  THESE_RESULTS: 'THESE_RESULTS',
  EVENTS: 'EVENTS',
  ATTRACTIONS: 'ATTRACTIONS',
};
