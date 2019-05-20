interface IHead {
  link: any[];
  vars: string[];
}
interface IAttractionResultValue {
  type: string;
  value: string;
  'xml:lang'?: string;
}
export interface IAttractionResult {
  [key: string]: IAttractionResultValue;
}

interface IResults {
  distinct: boolean;
  ordered: boolean;
  bindings: IAttractionResult[];
}
export interface ISparqlResponse {
  head: IHead;
  results: IResults;
}

export class SparqlResponse implements ISparqlResponse {
  public head: IHead;
  public results: IResults;

  public get keys(): string[] {
    return this.head.vars;
  }

  public get isDistinct(): boolean {
    return this.results.distinct;
  }
  public get isOrdered(): boolean {
    return this.results.ordered;
  }
}
