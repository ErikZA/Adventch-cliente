import { ReleaseNote } from './releaseNote.model';

export class Release {
  id: number;
  version: string;
  date: Date;
  notes: ReleaseNote[];

  constructor() { }
}
