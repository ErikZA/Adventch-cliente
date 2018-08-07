import { Feature } from './feature.model';

export class Funcionality {
  public id: number;
  public name: string;
  public feature: Feature;
  public position: number;
  public permission: boolean; // usado somente para o save. Não mapear no banco!
}
