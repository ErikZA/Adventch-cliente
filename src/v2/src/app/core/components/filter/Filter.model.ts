import { IFilterInterface } from './IFilter';

export class Filter implements IFilterInterface {
  constructor(
    public id: number,
    public name: string
  ) { }
}
