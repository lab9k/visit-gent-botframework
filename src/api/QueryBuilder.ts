import { QueryType } from './queries';

export class QueryBuilder {
  private lang: string = 'en';
  private query: string;

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

  public build(): string {
    return this.query.replace('{% lang %}', `'${this.lang}'`);
  }
}
