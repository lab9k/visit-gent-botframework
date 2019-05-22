import * as moment from 'moment';
import { QueryType } from './queries';

export class QueryBuilder {
  private lang: string = 'en';
  private query: string;
  private type: string;
  private startDate: moment.Moment = moment(moment.now());
  private endDate: moment.Moment = moment(moment.now());

  public addType(type: string): QueryBuilder {
    this.type = type;
    this.query =
      QueryType[type] ||
      (() => {
        throw new Error(`Query type '${type}' does not exist`);
      })();
    return this;
  }

  public addLang(lang: string): QueryBuilder {
    this.lang = lang;
    return this;
  }

  public addStartDate(unixTime: number): QueryBuilder {
    this.startDate = moment(unixTime);
    return this;
  }

  public addEndDate(unixTime: number): QueryBuilder {
    this.endDate = moment(unixTime);
    return this;
  }

  public build(): string {
    if (!this.query) {
      throw new Error(
        'QueryType must be specified. Have you tried \'new QueryBuilder().addType(type)\' ?',
      );
    }
    const startDateStr = this.startDate.format('YYYY-MM-DD');
    const endDateStr = this.endDate.format('YYYY-MM-DD');
    console.log(`Querying ${this.type} with:
    startDate: \t${startDateStr}
    endDate: \t${endDateStr}
    lang: \t${this.lang}`);
    return this.query
      .replace(/{% lang %}/g, `'${this.lang}'`)
      .replace(/{% startDate %}/g, startDateStr)
      .replace(/{% endDate %}/g, endDateStr);
  }
}
