import { DistrictsDataComponent } from './../districts-data/districts-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Districts } from '../../../models/districts';
import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { DistrictsStore } from '../districts.store';
import { auth } from '../../../../../auth/auth';

@Component({
  selector: 'app-districts-form',
  templateUrl: './districts-form.component.html',
  styleUrls: ['./districts-form.component.scss']
})
export class DistrictsFormComponent implements OnInit, OnDestroy {
  subscribeUnit: Subscription;

  formDistrict: FormGroup;
  routeSubscription: Subscription;
  params: any;
  values: any;
  users: any;
  editAnalyst: any;
  district: Districts;

  constructor(
    private formBuilder: FormBuilder,
    private treasuryService: TreasuryService,
    private store: DistrictsStore,
    private treasureService: TreasuryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private service: TreasuryService,
    private districtsDataComponent: DistrictsDataComponent
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadAnalysts();
    this.routeSubscription = this.route.params.subscribe((data) => {
      const id = parseInt(data.id, 10);
      if (Number.isInteger(id)) {
        this.editDistrict(id);
      }
    });
    this.districtsDataComponent.sidenavRight.open();
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
    this.closeSidenav();
  }

  private loadAnalysts(): void {
    const unit = this.authService.getCurrentUnit();
    this.service.getUsers2(unit.id).subscribe((data) => {
      this.users = data;
    });
  }

  private checkIsEdit(): boolean {
    return this.district !== undefined && this.district !== null;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar' : 'Novo';
  }

  initForm(): void {
    this.formDistrict = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      analyst: [null, Validators.required]
    });
  }

  closeSidenav() {
    this.districtsDataComponent.closeSidenav();
  }

  saveDistrict() {
    if (!this.formDistrict.valid) {
      return;
    }
    this.routeSubscription = this.route.params.subscribe(params => {
      this.params = params['id'];
    });
    const unit = auth.getCurrentUnit();
    // modificar para id, caso de conflito
    const valor = this.users.filter(x => x.id === this.formDistrict.value.analyst);
    this.values = {
      id: this.params,
      name: this.formDistrict.value.name,
      analyst: {
        id: this.formDistrict.value.analyst,
        name: valor[0].name,
      },
      id_unit: unit.id
    };

    if (this.formDistrict.valid) {
      this.treasuryService.saveDistricts(this.values).subscribe((data) => {
        this.snackBar.open('Distrito salvo com sucesso!', 'OK', { duration: 5000 });
        this.formDistrict.markAsUntouched();
        this.closeSidenav();
        this.districtsDataComponent.getData(unit.id);
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar distrito, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }
  editDistrict(id: number) {
    this.treasureService.getDistrict(id).subscribe(res => {
      this.formDistrict.patchValue({
        name: res.name,
        analyst: res.analyst.id
      });
    });
  }
  resetAllForms() {
    this.formDistrict.reset();
  }
}
