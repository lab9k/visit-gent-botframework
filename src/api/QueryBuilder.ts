import * as moment from 'moment';
import { QueryType } from './queries';

export class QueryBuilder {
  private lang: string = 'en';
  private query: string;
  private startDate: moment.Moment = moment(moment.now());
  private endDate: moment.Moment = moment(moment.now()).add(1, 'days');

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
    // TODO: start & endDates don't work on the endpoint. (incorrect data)
    return this.query
      .replace('{% lang %}', `'${this.lang}'`)
      .replace(
        '{% startDate %}',
        `"${new Date(this.startDate.utc().format())}"^^xsd:dateTime`,
      )
      .replace(
        '{% endDate %}',
        `"${new Date(this.endDate.utc().format())}"^^xsd:dateTime`,
      );
  }
}
