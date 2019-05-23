import { StatePropertyAccessor, TurnContext } from 'botbuilder';
import { DialogState } from 'botbuilder-dialogs';
import { ILanguage } from './Language';

export interface IRunnable {
  run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>,
    languageChoiceAccessor: StatePropertyAccessor<ILanguage>,
  ): Promise<void>;
}
