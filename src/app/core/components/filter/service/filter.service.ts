import { Injectable } from '@angular/core';
import { utils } from '../../../../shared/utils';
import { Subject } from 'rxjs';
import { Module, EModules } from '../../../../shared/models/modules.enum';
import { Type } from '@angular/compiler/src/core';
import { OnDestroy } from '@angular/core';


@Injectable()
export class FilterService {
  private data: any = [];
  private properties: any = [];
  private propertiesEnums: any = [];

  constructor() { }

  destroy(): void {
    this.data = [];
    this.properties = [];
    this.propertiesEnums = [];
  }


  /**
   * Configurar filtragem
   * @param data array listado na gerência
   * @param properties lista de propriedades a serem filtradas
   * @param enumsProperties lista de enums a serem filtrados
   */
  public setConfiguration(data: any, properties: any, enumsProperties?: any): void {
    this.data = data;
    this.properties = properties;
    this.propertiesEnums = enumsProperties;
  }

  /**
   * Filtrar na gerência
   * @param search string de busca
   */
  public search(search: string): any {
    return this.data.filter(f =>
      this.checkObject(f, search.toLowerCase())
    );
  }

  private checkObject(object: any, search: string): boolean {
    if (this.properties) {
      for (let i = 0; i < this.properties.length; i++) {
        const value = this.getValue(object, this.properties[i]);
        if (this.checkValue(value, search)) {
          return true;
        }
      }
    }

    if (this.propertiesEnums) {
      for (let i = 0; i < this.propertiesEnums.length; i++) {
        const value = this.getValue(object, this.propertiesEnums[i]);
        const valueEnum = this.getValueFromEnum(this.propertiesEnums[i], parseInt(value));
        if (this.checkValue(valueEnum, search)) {
          return true;
        }
      }
    }
    return false;
  }

  private checkIsArray(object: any, property: string): boolean {
    return Array.isArray(object[property]);
  }

  private getValue(object: any, property: string): string {
    return String(object[property]).toLowerCase();
  }

  private checkValue(value: string, search: string): boolean {
    return utils.buildSearchRegex(search).test(value.toUpperCase());
  }

  private getValueFromEnum(enumType: string, enumValue: number): any {
    if (enumType === 'software') {
      return new Module(enumValue).getModuleName();
    }
  }

  public check(id, data): number[] {
    id = Number(id);
    if (data.some(x => x === id)) {
      data = data.filter(x => x !== id);
    } else {
      data.push(id);
    }
    return data;
  }

  public checkArray(id, data): boolean {
    return data.some(x => x === Number(id));
  }

  /**
   * Método para filtragem avançada
   * @param data lista
   * @param property nome da propriedade, exemplo 'district.id'
   * @param selecteds lista de ids selecionados
   */
  public filter(data: any, property: string, selecteds: any) {
    if (selecteds.length === 0) {
      return data;
    }
    return data.filter(f => this.checkArray(this.fetchFromObject(f, property), selecteds));
  }

  private fetchFromObject(obj, property) {
    if (typeof obj === 'undefined') {
      return false;
    }

    const index = property.indexOf('.');
    if (index > -1) {
      return this.fetchFromObject(obj[property.substring(0, index)], property.substr(index + 1));
    }

    return obj[property];
  }
}
