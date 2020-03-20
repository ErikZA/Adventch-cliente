export enum EMonth {
  Janeiro = 'Janeiro',
  Fevereiro = 'Fevereiro',
  Marco = 'Março',
  Abril = 'Abril',
  Maio = 'Maio',
  Junho = 'Junho',
  Julho = 'Julho',
  Agosto = 'Agosto',
  Setembro = 'Setembro',
  Outubro = 'Outubro',
  Novembro = 'Novembro',
  Dezembro = 'Dezembro'
  /*Mapping from dbo.software*/
}

export class Months {

  constructor(
    private months: EMonth
  ) { }

  public getMonthNumber(): number {
    switch (this.months) {
      case 'Janeiro':
          return 1;
      case 'Fevereiro':
        return 2;
      case 'Março':
        return 3;
      case 'Abril':
        return 4;
      case 'Maio':
        return 5;
      case 'Junho':
        return 6;
      case 'Julho':
        return 7;
      case 'Agosto':
        return 8;
      case 'Setembro':
        return 9;
      case 'Outubro':
        return 10;
      case 'Novembro':
        return 11;
      case 'Dezembro':
        return 12;
      default:
        return -1;
    }
  }
}
