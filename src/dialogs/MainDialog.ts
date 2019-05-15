import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
  ChoicePrompt,
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  WaterfallDialog,
  WaterfallStepContext,
} from 'botbuilder-dialogs';
import { ILogger } from '../logger';
const MAIN_WATERFALL_DIALOG = 'mainwaterfalldialog';
export class MainDialog extends ComponentDialog {
  private logger: ILogger;

  constructor(logger: ILogger) {
    super('MainDialog');

    if (!logger) {
      logger = console as ILogger;
      logger.log('[MainDialog]: logger not passed in, defaulting to console');
    }
    this.logger = logger;

    this.addDialog(new ChoicePrompt('TextPrompt'));
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [this.introStep.bind(this)]),
    );
    this.initialDialogId = MAIN_WATERFALL_DIALOG;
  }

  public async run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>,
  ) {
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
    return await step.prompt('TextPrompt', {
      prompt: 'What can i help you with today?',
      choices: [{ value: 'Event' }, { value: 'Attraction' }],
    });
  }
}
