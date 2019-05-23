export interface ILanguage {
  sparqlLanguageProp: string;
  langCode: string;
  name: string;
}

export const languages: ILanguage[] = [
  { sparqlLanguageProp: 'nl', langCode: 'nl-be', name: 'Nederlands' },
  { sparqlLanguageProp: 'en', langCode: 'en', name: 'English' },
  { sparqlLanguageProp: 'fr', langCode: 'fr', name: 'Français' },
  { sparqlLanguageProp: 'de', langCode: 'de', name: 'Deutsch' },
  { sparqlLanguageProp: 'es', langCode: 'es', name: 'Espagnol' },
];
