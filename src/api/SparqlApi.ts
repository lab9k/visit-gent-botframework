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
      return resp.data as SparqlResponse;
    } catch (error) {
      throw error;
    }
  }
}
