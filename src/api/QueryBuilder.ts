import * as moment from 'moment';
import { QueryType } from './queries';

export class QueryBuilder {
  private lang: string = 'en';
  private query: string;
  private startDate: moment.Moment = moment(moment.now());
  private endDate: moment.Moment = moment(moment.now());

  public addType(type: string): QueryBuilder {
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
    return this.query
      .replace('{% lang %}', `'${this.lang}'`)
      .replace('{% startDate %}', this.startDate.format('YYYY-MM-DD'))
      .replace('{% endDate %}', this.endDate.format('YYYY-MM-DD'));
  }
}
