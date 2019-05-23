import {
  ActivityHandler,
  BotState,
  ConversationState,
  StatePropertyAccessor,
  TurnContext,
  UserState,
} from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { MainDialog } from './dialogs/MainDialog';
import { ILogger } from './logger';
import { IRunnable } from './models/IRunnable';
import { ILanguage } from './models/Language';

export class VisitBot extends ActivityHandler {
  private conversationState: BotState;
  private userState: BotState;
  private logger: ILogger;
  private dialog: Dialog;
  private dialogState: StatePropertyAccessor<DialogState>;
  private languageChoiceState: StatePropertyAccessor<ILanguage>;

  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog,
    logger: ILogger = console as ILogger,
  ) {
    super();

    this.conversationState = conversationState as ConversationState;
    this.userState = userState as UserState;
    this.dialog = dialog;
    this.logger = logger;
    this.dialogState = this.conversationState.createProperty<DialogState>(
      'DialogState',
    );
    this.languageChoiceState = this.conversationState.createProperty<ILanguage>(
      'languageChoiceState',
    );

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(this.handleMessage.bind(this));

    this.onMembersAdded(this.handleMembersAdded.bind(this));

    this.onDialog(this.handleDialog.bind(this));
  }

  private async handleMessage(context: TurnContext, next: () => Promise<void>) {
    this.logger.log('Running dialog with Message Activity.');

    // Run the Dialog with the new message Activity.
    await (this.dialog as MainDialog).run(
      context,
      this.dialogState,
      this.languageChoiceState,
    );

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);

    await next();
  }

  private async handleMembersAdded(
    context: TurnContext,
    next: () => Promise<void>,
  ) {
    const membersAdded = context.activity.membersAdded;
    for (const member of membersAdded) {
      if (member.id !== context.activity.recipient.id) {
        await context.sendActivity('Hallo en welkom!');
        await this.handleMessage(context, next);
      }
    }
    // By calling next() you ensure that the next BotHandler is run.
    await next();
  }

  private async handleDialog(context: TurnContext, next: () => Promise<void>) {
    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);

    // By calling next() you ensure that the next BotHandler is run.
    await next();
  }
}
