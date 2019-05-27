import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
  ChoicePrompt,
  ComponentDialog,
  Dialog,
  DialogSet,
  DialogState,
  DialogTurnStatus,
} from 'botbuilder-dialogs';
import { ILogger } from '../logger';
import { IRunnable } from '../models/IRunnable';
import { ILanguage } from '../models/Language';
import { AttractionDialog } from './AttractionDialog';
import { LanguageSelectionDialog } from './LanguageSelectionDialog';

export class MainDialog extends ComponentDialog implements IRunnable {
  private logger: ILogger;
  private langSelectionDialog: Dialog;

  constructor(logger: ILogger = console as ILogger) {
    super('MainDialog');

    this.logger = logger;

    this.addDialog(new ChoicePrompt('TextPrompt'));
    this.langSelectionDialog = new LanguageSelectionDialog(logger);

    this.addDialog(this.langSelectionDialog);
    this.initialDialogId = this.langSelectionDialog.id;
  }

  public async run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>,
    languageChoiceAccessor: StatePropertyAccessor<ILanguage>,
  ): Promise<void> {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);
    const attractionDialog = new AttractionDialog(
      this.logger,
      languageChoiceAccessor,
    );
    dialogSet.add(attractionDialog);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();

    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    } else if (results.status === DialogTurnStatus.complete) {
      if ('momentLangCode' in results.result) {
        // ? completed language selection
        const chosenLang = results.result as ILanguage;
        languageChoiceAccessor.set(context, chosenLang);
        await dialogContext.beginDialog(attractionDialog.id);
      }
    }
  }
}
