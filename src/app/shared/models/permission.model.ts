import { EPermissions } from './permissions.enum';

export class Permission {

  public id: number;
  public name: string;
  public isActive: boolean;

  constructor(
    id: EPermissions
  ) {
    this.id = id;
  }

  public getPermissionName(): string {
    switch (this.id) {
      case 1:
        return 'Criar';
      case 2:
        return 'Visualizar';
      case 3:
        return 'Editar';
      case 4:
        return 'Excluir';
      default:
        return 'Nenhum';
    }
  }
}
