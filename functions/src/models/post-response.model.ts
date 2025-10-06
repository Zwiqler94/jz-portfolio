/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryResult } from 'pg';

export class PostDBResponse {
  posts: QueryResult<any> | undefined = {
    rows: [],
    command: '',
    rowCount: null,
    oid: 0,
    fields: [],
  };

  createBlankResponse(): QueryResult<any> | undefined {
    return {
      rows: [],
      command: '',
      rowCount: null,
      oid: 0,
      fields: [],
    };
  }
}
