import {
  ActionTypes,
  ActivityTypes,
  Attachment,
  CardAction,
  CardFactory,
  MessageFactory,
  StatePropertyAccessor,
  TurnContext,
} from 'botbuilder';
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
import { map, sample, sampleSize } from 'lodash';
import * as moment from 'moment';
import { api, QueryBuilder, QueryType } from '../api';
import { ILogger } from '../logger';
import { IAttractionResult } from '../models/SparqlResponse';

const MAIN_WATERFALL_DIALOG = 'mainwaterfalldialog';
export class MainDialog extends ComponentDialog {
  private logger: ILogger;

  constructor(logger: ILogger = console as ILogger) {
    super('MainDialog');

    this.logger = logger;

    this.addDialog(new ChoicePrompt('TextPrompt'));
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.introStep.bind(this),
        this.handleCategoryChoice.bind(this),
      ]),
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
      choices: Object.keys(QueryType).map(k => ({ value: k })),
    });
  }

  private async handleCategoryChoice(
    step: WaterfallStepContext,
  ): Promise<DialogTurnResult> {
    await step.context.sendActivity(
      `Dit zijn de "${
        step.context.activity.text
      }" die momenteel te bezoeken zijn.`,
    );
    await step.context.sendActivity({ type: ActivityTypes.Typing });
    const q = new QueryBuilder()
      .addType(step.context.activity.text)
      .addLang('nl');
    const responses = await api.query(q.build());
    const carousel = this.getCarouselFrom(responses.results.bindings);
    const carouselSlice = sampleSize(carousel, 5);
    const message = MessageFactory.carousel(carouselSlice);
    await step.context.sendActivity(message);
    return step.endDialog(responses);
  }

  private getCarouselFrom(attractions: IAttractionResult[]): Attachment[] {
    return map(attractions, attraction => {
      const cardButtons: CardAction[] = [
        {
          title: 'Website',
          value: attraction.page.value,
          type: ActionTypes.OpenUrl,
        },
      ];
      if (process.env.NODE_ENV === 'development') {
        cardButtons.push({
          title: 'Data uri',
          value: attraction.attraction.value,
          type: ActionTypes.OpenUrl,
        });
      }
      // TODO: get locale from userSate
      moment.locale('nl-be');
      const fromDate = moment(attraction.fromMin.value, 'YYYY-MM-DD').format(
        'D MMMM YYYY',
      );
      const toDate = moment(attraction.toMax.value, 'YYYY-MM-DD').format(
        'D MMM YYYY',
      );
      return CardFactory.heroCard(
        attraction.name.value,
        `${fromDate} - ${toDate}`,
        [sample(attraction.imagesList)],
        cardButtons,
      );
    });
  }
}
