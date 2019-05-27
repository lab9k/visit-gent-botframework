export interface ILanguage {
  sparqlLanguageProp: string;
  momentLangCode: string;
  name: string;
}

export const languages: ILanguage[] = [
  { sparqlLanguageProp: 'nl', momentLangCode: 'nl-be', name: 'Nederlands' },
  { sparqlLanguageProp: 'en', momentLangCode: 'en', name: 'English' },
  { sparqlLanguageProp: 'fr', momentLangCode: 'fr', name: 'Français' },
  { sparqlLanguageProp: 'de', momentLangCode: 'de', name: 'Deutsch' },
  { sparqlLanguageProp: 'es', momentLangCode: 'es', name: 'Espagnol' },
];
