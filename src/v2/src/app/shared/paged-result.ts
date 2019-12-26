import { PagedResultBase } from './paged-result-base';

export class PagedResult<T> extends PagedResultBase {
  results: Array<T>;

  public PagedResult() {
    this.results = new Array<T>();
  }
}
