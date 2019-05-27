import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
  ChoicePrompt,
  ComponentDialog,
  DialogReason,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  WaterfallDialog,
  WaterfallStepContext,
} from 'botbuilder-dialogs';
import { ILogger } from '../logger';
import { IRunnable } from '../models/IRunnable';
import { ILanguage, languages } from '../models/Language';
import translations from '../translations';

const LANGUAGE_WATERFALL_DIALOG = 'language_waterfall_dialog';
export class LanguageSelectionDialog extends ComponentDialog
  implements IRunnable {
  private logger: ILogger;

  constructor(logger: ILogger = console as ILogger) {
    super('LanguageSelectionDialog');

    this.logger = logger;

    this.addDialog(new ChoicePrompt('language_prompt'));
    this.addDialog(
      new WaterfallDialog(LANGUAGE_WATERFALL_DIALOG, [
        this.introStep.bind(this),
        this.handleResult.bind(this),
      ]),
    );
    this.initialDialogId = LANGUAGE_WATERFALL_DIALOG;
  }

  public async run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>,
  ): Promise<void> {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  private async introStep(
    step: WaterfallStepContext,
  ): Promise<DialogTurnResult> {
    return await step.prompt('language_prompt', {
      prompt: 'Please pick a language to receive results in.',
      retryPrompt: 'Please use the buttons provided',
      choices: languages.map(l => ({
        value: l.name,
      })),
    });
  }

  private async handleResult(
    step: WaterfallStepContext,
  ): Promise<DialogTurnResult<ILanguage>> {
    const lang = languages.find(el => el.name === step.context.activity.text);
    await step.context.sendActivity(
      translations.getStringFor(
        translations.SET_LANGUAGE,
        lang.sparqlLanguageProp,
      ),
    );
    return step.endDialog(lang);
  }
}
