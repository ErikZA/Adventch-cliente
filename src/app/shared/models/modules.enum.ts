export enum EModules {
  General = 0,
  Apps = 1,
  Payment = 2,
  Events = 3,
  Telephony = 5,
  Treasury = 6,
  Scholarship = 7,
  Administration = 8
  /*Mapping from dbo.software*/
}

export class Module {

  constructor(
    private module: EModules
  ) { }

  public getModuleName(): string {
    switch (this.module) {
      case 0:
        return 'Geral';
      case 1:
        return 'Aplicativos';
      case 2:
        return 'Pagamentos';
      case 3:
        return 'Eventos';
      case 5:
        return 'Telefonia';
      case 6:
        return 'Tesouraria';
      case 7:
        return 'Bolsas';
      case 8:
        return 'Administração';
      default:
        return 'Nenhum';
    }
  }
}
