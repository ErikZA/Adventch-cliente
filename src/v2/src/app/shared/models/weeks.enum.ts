export enum EWeeks {
  Mensal = 0,
  Semana_1 = 1,
  Semana_2 = 2,
  Semana_3 = 3,
  Semana_4 = 5,
  Seman_5 = 6,
  Semana_6 = 7,
  Anual = 9,
  NaoPossui = -1
  /*Mapping from dbo.reference_evaluation*/
}

export class Weeks {

  constructor(
    private weeks: EWeeks
  ) { }

  public getWeekName(): string {
    switch (this.weeks) {
      case 0:
        return 'Mensal';
      case 1:
        return '1º Semana';
      case 2:
        return '2º Semana';
      case 3:
        return '3º Semana';
      case 4:
        return '4º Semana';
      case 5:
        return '5º Semana';
      case 6:
        return '6º Semana';
      case 9:
        return 'Anual';
      case -1:
        return 'Nenhum';
      default:
        return 'Nenhum';
    }
  }
}
