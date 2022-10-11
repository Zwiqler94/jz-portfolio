import { Observable } from 'rxjs';

export interface MediaCacheModel {
  index: number;
  url: Observable<string | null>;
}
