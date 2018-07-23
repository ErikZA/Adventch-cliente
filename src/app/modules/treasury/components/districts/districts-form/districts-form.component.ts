import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreasuryService } from '../../../treasury.service';
import { DistrictsStore } from '../districts.store';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { Districts } from '../../../models/districts';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../shared/auth.service';

@Component({
  selector: 'app-districts-form',
  templateUrl: './districts-form.component.html',
  styleUrls: ['./districts-form.component.scss']
})
export class DistrictsFormComponent implements OnInit {

  formDistrict: FormGroup;
  routeSubscription: Subscription;
  params: any;
  values: any;
  users: any;
  editAnalyst: any;

  constructor(
    private formBuilder: FormBuilder,
    private treasuryService: TreasuryService,
    private store: DistrictsStore,
    private treasureService: TreasuryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private service: TreasuryService,
  ) { }
  ngOnInit() {
    this.initForm();
    this.service.getUsers().subscribe((data) => {
      this.users = data;
    });

    this.routeSubscription = this.route.params.subscribe((data) => {
      if (data.id) {
        this.editDistrict(this.store.districts);
      }

    });
  }

  initForm(): void {
    this.formDistrict = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^(\w+\s?)*$/)]],
      analyst: [null]
    });
  }

  closeSidenav() {
    this.treasureService.setDistrict(new Districts());
    this.sidenavService.close();
    this.router.navigate(['tesouraria/distritos']);
  }

  saveDistrict() {
    if (!this.formDistrict.valid) {
      return;
    }
    this.routeSubscription = this.route.params.subscribe(params => {
      this.params = params['id'];
    });
    const unit = this.authService.getCurrentUnit();
    // modificar para id, caso de conflito
    const valor = this.users.filter( x => x.name === this.formDistrict.value.analyst);

    this.values = {
      id: this.params,
      name: this.formDistrict.value.name,
      analyst:
        {
          id: valor[0].id,
          name: this.formDistrict.value.analyst,
        },
      id_unit: unit.id };

    if (this.formDistrict.valid) {
      this.treasuryService.saveDistricts(this.values).subscribe((data) => {
        this.store.updateDistricts(this.values);
        this.snackBar.open('Distrito armazenado com sucesso!', 'OK', { duration: 5000 });
        this.formDistrict.markAsUntouched();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar distrito, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }

  editDistrict(district) {
    this.formDistrict.setValue({
      name: district.name,
      analyst: district.analyst,
    });
    this.editAnalyst = district.analyst.name;
  }


  close() {
    this.store.openDistrict(new Districts());
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace('/novo', '').replace('distritos/' + this.values.id + '/editar', 'distritos')]);
    this.resetAllForms();
  }

  resetAllForms() {
    this.formDistrict.reset();
  }
}
