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
  /*Mapping from dbo.software*/
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
        return 'Semana-1';
      case 2:
        return 'Semana-2';
      case 3:
        return 'Semana-3';
      case 4:
        return 'Semana-4';
      case 5:
        return 'Semana-5';
      case 6:
        return 'Semana-6';
      case 9:
        return 'Anual';
      case -1:
        return 'Nenhum';
      default:
        return 'Nenhum';
    }
  }
}
