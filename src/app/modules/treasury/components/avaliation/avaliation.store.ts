import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Avaliation, AvaliationList } from '../../models/avaliation';
import { TreasuryService } from '../../treasury.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { auth } from '../../../../auth/auth';
import { Districts } from '../../models/districts';
@Injectable()
export class AvaliationStore {

    avaliations$: Observable<AvaliationList[]>;
    private _avaliations: BehaviorSubject<AvaliationList[]>;
    public avaliation: Avaliation;
    public isMensal: boolean;
    
    districts$: Observable<Districts[]>;
    private _districts: BehaviorSubject<Districts[]>;

    private dataStore: {
        avaliations: AvaliationList[],
        districts: Districts[]
    };

    constructor(
        private service: TreasuryService,
        private snackBar: MatSnackBar,
        private sidenavService: SidenavService
    ) {
        this.dataStore = {
            avaliations: [],
            districts: []
        };
        this._avaliations = <BehaviorSubject<AvaliationList[]>>new BehaviorSubject([]);
        this.avaliations$ = this._avaliations.asObservable();  

        this._districts = <BehaviorSubject<Districts[]>>new BehaviorSubject([]);
        this.districts$ = this._districts.asObservable();          
    }
    
  /* Listagem */
  public loadAll(): void {
    const unit = auth.getCurrentUnit();
    this.service.getAvaliations(unit.id).subscribe((data: any[]) => {
      this.dataStore.avaliations = data;
      this._avaliations.next(Object.assign({}, this.dataStore).avaliations);
      this.loadDistricts()
    });
  }  
  

  private loadDistricts() {
    this.dataStore.districts = new Array<Districts>();
    if (this.dataStore.avaliations && Array.isArray(this.dataStore.avaliations)) {
      this.dataStore.avaliations.forEach(avaliation => {
        if (avaliation.church.district && avaliation.church.district.id !== 0 && this.dataStore.districts.map(x => x.id).indexOf(avaliation.church.district.id) === -1) {
          this.dataStore.districts.push(avaliation.church.district);
        }
      });
      this._districts.next(Object.assign({}, this.dataStore).districts);
      this.dataStore.districts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  /* Filtro */
  public searchText(search: string): AvaliationList[] {
    if (search === '' || search === undefined || search === null) {
      return this.dataStore.avaliations;
    } else {
      return this.dataStore.avaliations.filter(data => {
        return this.testFilter(data.church.code, search)
        || this.testFilter(data.church.name, search)
        || this.testFilter(data.church.district.name, search)
        || this.testFilter(data.total.toString(), search)
        || this.filterStatus(search, data.status)
      });
    }
  }

  private testFilter(field: string, search: string): boolean {
    return field.toLowerCase().indexOf(search.toLowerCase()) !== -1
  }

  private filterStatus(search: string, status: number): boolean {
    if (status === 1) {
      return 'aguardando'.indexOf(search) !== -1;
    }
    if (status === 2) {
      return 'avaliado'.indexOf(search) !== -1;
    }
    if (status === 3) {
      return 'finalizado'.indexOf(search) !== -1;
    }
    return false;
  }

  public searchDistricts(idDistrict: number, avaliations: AvaliationList[]): AvaliationList[] {
    return avaliations.filter(x => x.church.district.id == idDistrict);
  }

  public searchAnalysts(idAnalyst: number, avaliations: AvaliationList[]): AvaliationList[] {
    return avaliations.filter(x => x.church.district.analyst.id == idAnalyst);
  }

  public searchPeriods(period: string, avaliations: AvaliationList[]): AvaliationList[] {
      const year = new Date(period).getFullYear();
      return avaliations.filter(x => new Date(x.date).getFullYear() === year);
  }
}
