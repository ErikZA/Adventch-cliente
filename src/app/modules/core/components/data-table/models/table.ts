import { Observable } from 'rxjs/Observable';
import { Column } from './column';

export interface Table {
  data?: Observable<any> | any,
  columns?: Array<Column>
  options?: {
    select?: boolean,
    buttonNew?: boolean,
  }
}
