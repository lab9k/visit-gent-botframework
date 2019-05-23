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
  DialogContext,
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
import { IRunnable } from '../models/IRunnable';
import { ILanguage } from '../models/Language';
import { IAttractionResult } from '../models/SparqlResponse';

const ATTRACTION_WATERFALL_DIALOG = 'attractionwaterfalldialog';
export class AttractionDialog extends ComponentDialog implements IRunnable {
  private logger: ILogger;
  private languageChoiceAccessor: StatePropertyAccessor<ILanguage>;

  constructor(
    logger: ILogger = console as ILogger,
    languageChoiceAccessor: StatePropertyAccessor<ILanguage>,
  ) {
    super('AttractionDialog');

    this.logger = logger;
    this.languageChoiceAccessor = languageChoiceAccessor;

    this.addDialog(new ChoicePrompt('query_type_prompt'));
    this.addDialog(
      new WaterfallDialog(ATTRACTION_WATERFALL_DIALOG, [
        this.introStep.bind(this),
        this.handleCategoryChoice.bind(this),
      ]),
    );
    this.initialDialogId = ATTRACTION_WATERFALL_DIALOG;
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
    const lang = await this.languageChoiceAccessor.get(step.context);
    return await step.prompt('query_type_prompt', {
      prompt: `What would you like to see?@${lang.langCode}`,
      retryPrompt: 'Please use the buttons provided',
      choices: Object.keys(QueryType).map(k => ({ value: k })),
    });
  }

  private async handleCategoryChoice(
    step: WaterfallStepContext,
  ): Promise<DialogTurnResult> {
    const lang = await this.languageChoiceAccessor.get(step.context);
    await step.context.sendActivity(
      `Dit zijn de "${
        step.context.activity.text
      }" die momenteel te bezoeken zijn.@${lang.langCode}`,
    );
    await step.context.sendActivity({ type: ActivityTypes.Typing });

    const q = new QueryBuilder()
      .addType(step.context.activity.text)
      .addLang(lang.sparqlLanguageProp);
    const responses = await api.query(q.build());
    const carousel = this.getCarouselFrom(
      responses.results.bindings,
      lang.langCode,
    );
    const carouselSlice = sampleSize(carousel, 5);
    const message = MessageFactory.carousel(carouselSlice);
    await step.context.sendActivity(message);
    return step.endDialog(responses);
  }
  private getCarouselFrom(
    attractions: IAttractionResult[],
    langCode: string,
  ): Attachment[] {
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
      moment.locale(langCode);
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
