import { IFilterInterface } from './IFilter';

export class Filter implements IFilterInterface {
  constructor(
    public id: Number,
    public name: string
  ) { }
}
