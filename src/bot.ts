import {
  ActivityHandler,
  BotState,
  ConversationState,
  StatePropertyAccessor,
  UserState,
} from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { MainDialog } from './dialogs/MainDialog';
import { ILogger } from './logger';

export class VisitBot extends ActivityHandler {
  private conversationState: BotState;
  private userState: BotState;
  private logger: ILogger;
  private dialog: Dialog;
  private dialogState: StatePropertyAccessor<DialogState>;
  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog,
    logger: ILogger,
  ) {
    super();
    if (!logger) {
      logger = console as ILogger;
      logger.log('[VisitBot]: logger not passed in, defaulting to console');
    }

    this.conversationState = conversationState as ConversationState;
    this.userState = userState as UserState;
    this.dialog = dialog;
    this.logger = logger;
    this.dialogState = this.conversationState.createProperty<DialogState>(
      'DialogState',
    );

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      this.logger.log('Running dialog with Message Activity.');

      // Run the Dialog with the new message Activity.
      await (this.dialog as MainDialog).run(context, this.dialogState);

      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity('Hello and welcome!');
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onDialog(async (context, next) => {
      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}
