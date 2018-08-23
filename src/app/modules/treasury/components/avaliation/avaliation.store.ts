import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Avaliation, ChurchAvaliation } from '../../models/avaliation';
import { TreasuryService } from '../../treasury.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { auth } from '../../../../auth/auth';
import { Districts } from '../../models/districts';
import { AvaliationRequirement } from '../../models/avaliationRequirement';
@Injectable()
export class AvaliationStore {

    avaliations$: Observable<ChurchAvaliation[]>;
    private _avaliations: BehaviorSubject<ChurchAvaliation[]>;
    public avaliation: Avaliation;
    public churchAvaliation: ChurchAvaliation;
    public isMensal: boolean;
    public period: Date = new Date();
    
    districts$: Observable<Districts[]>;
    private _districts: BehaviorSubject<Districts[]>;

    private dataStore: {
        avaliations: ChurchAvaliation[],
        districts: Districts[]
    };

    constructor(
        private service: TreasuryService,
        private snackBar: MatSnackBar,
        private sidenavService: SidenavService,
        private location: Location,
    ) {
        this.dataStore = {
            avaliations: [],
            districts: []
        };
        this._avaliations = <BehaviorSubject<ChurchAvaliation[]>>new BehaviorSubject([]);
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
  public getAvaliationByPeriod(churchAvaliations: ChurchAvaliation, period: Date): Avaliation {
    var avaliation = new Avaliation();
    churchAvaliations.avaliations.forEach(f => {
      var date = new Date(f.date);
      if (date.getMonth() === period.getMonth() && date.getFullYear() === period.getFullYear()) {
        avaliation = f;
      }
    });
    return avaliation;
  }

  public getMensalAvaliation(churchAvaliations: ChurchAvaliation, period: Date): Avaliation {
    var avaliation = new Avaliation();
    churchAvaliations.avaliations.forEach(f => {
      var date = new Date(f.date);
      if (f.isMensal && date.getMonth() === period.getMonth() && date.getFullYear() === period.getFullYear()) {
        avaliation = f;
      }
    });
    return avaliation;
  }

  public getAnualAvaliation(churchAvaliations: ChurchAvaliation, year: number): Avaliation {
    var avaliation = new Avaliation();
    churchAvaliations.avaliations.forEach(f => {
      var date = new Date(f.date);
      if (!f.isMensal && date.getFullYear() === year) {
        avaliation = f;
      }
    });
    return avaliation;
  }

  public searchText(search: string): ChurchAvaliation[] {
    if (search === '' || search === undefined || search === null) {
      return this.dataStore.avaliations;
    } else {
      return this.dataStore.avaliations.filter(data => {
        return this.testFilter(data.church.code, search)
        || this.testFilter(data.church.name, search)
        || this.testFilter(data.church.district.name, search)
        /*|| this.testFilter(data.total.toString(), search)
        || this.filterStatus(search, data.status)*/
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

  public searchStatus(idStatus: number, churchAvaliations: ChurchAvaliation[], period: Date): ChurchAvaliation[] {
    var churchAvaliationsFiltered = new Array<ChurchAvaliation>();
    for (let churchAvaliation of churchAvaliations) {
      if (this.searchStatusInAvaliations(idStatus, churchAvaliation, period)) {
        churchAvaliationsFiltered.push(churchAvaliation);
      }
    }
    return churchAvaliationsFiltered;
  }

  private searchStatusInAvaliations(idStatus: number, churchAvaliation: ChurchAvaliation, period: Date): boolean {
    if (idStatus === 1 && churchAvaliation.avaliations.length === 0) {
      return true;
    }
    var obj = this.getMensalAvaliation(churchAvaliation, period);
    if (obj.status === idStatus) {
        return true;
    }
    return false;
  }

  public searchDistricts(idDistrict: number, avaliations: ChurchAvaliation[]): ChurchAvaliation[] {
    return avaliations.filter(x => x.church.district.id == idDistrict);
  }

  public searchAnalysts(idAnalyst: number, avaliations: ChurchAvaliation[]): ChurchAvaliation[] {
    return avaliations.filter(x => x.church.district.analyst.id == idAnalyst);
  }

  public searchMonth(month: number, churchAvaliations: ChurchAvaliation[]): ChurchAvaliation[] {
    return churchAvaliations.filter(f1 => {
      return f1.avaliations.filter(f2 => new Date(f2.date).getMonth() === month && f2.isMensal)
    });
  }

  public searchYear(year: number, churchAvaliations: ChurchAvaliation[]): ChurchAvaliation[] {
    return churchAvaliations.filter(f1 => {
      return f1.avaliations.filter(f2 => new Date(f2.date).getFullYear() === year && f2.isMensal)
    });
  }

  /*Salvar*/    
  public save(data): void {
    debugger;
    this.service.postAvaliation(data).subscribe((profile: Avaliation) => {
      setTimeout(() => {
        debugger;
        this.location.back();
        this.sidenavService.close();
        this.avaliation = new Avaliation();
        this.loadAll();
      }, 1000);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar avaliação, tente novamente.', 'OK', { duration: 5000 });
    });
  }
}
