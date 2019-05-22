import axios, { AxiosInstance } from 'axios';
import { ISparqlResponse, SparqlResponse } from '../models/SparqlResponse';

export class SparqlApi {
  private options: { format: string; debug: string };
  private instance: AxiosInstance;

  constructor(private baseURL: string) {
    this.options = {
      format: 'application/sparql-results+json',
      debug: 'on',
    };
    this.instance = axios.create({ baseURL });
  }

  public async query(query: string): Promise<SparqlResponse> {
    try {
      const resp = await this.instance.get('', {
        params: { ...this.options, query },
      });
      const data = resp.data as SparqlResponse;
      const retBindings = [...data.results.bindings];
      const newBindings = [];
      retBindings.forEach((attr) => {
        const found = newBindings.find(
          (el) => el.attraction.value === attr.attraction.value,
        );
        if (found) {
          found.imagesList.push(found.image.value);
        } else {
          const newAttr = { ...attr, imagesList: [attr.image.value] };

          newBindings.push(newAttr);
        }
      });
      data.results.bindings = newBindings;
      return data;
    } catch (error) {
      throw error;
    }
  }
}
