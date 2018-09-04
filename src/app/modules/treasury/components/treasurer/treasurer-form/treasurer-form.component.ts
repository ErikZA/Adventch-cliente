import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TreasuryService } from '../../../treasury.service';
import { Phone } from '../../../models/phone';
import { Church } from '../../../models/church';
import { Treasurer } from '../../../models/treasurer';
import * as moment from 'moment';
import { TreasurerDataComponent } from '../treasurer-data/treasurer-data.component';
import { auth } from '../../../../../auth/auth';
import 'rxjs/add/operator/switchMap';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';

@Component({
  selector: 'app-treasurer-form',
  templateUrl: './treasurer-form.component.html',
  styleUrls: ['./treasurer-form.component.scss']
})
@AutoUnsubscribe()
export class TreasurerFormComponent implements OnInit, OnDestroy {
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formPhones: FormArray;
  formContact: FormGroup;
  lstChurches: Church[] = [];
  treasurer: Treasurer;
  dates: any;
  loading = true;

  sub1: Subscription;
  constructor(
    private treasuryService: TreasuryService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private treasurerDataComponent: TreasurerDataComponent
  ) { }

  ngOnInit() {
    this.initConfigurations();
    this.initForm();
    this.sub1 = this.getChurches()
      .switchMap(() => this.activatedRoute.params)
      .do(({ id }) => this.loading = !!id)
      .skipWhile(({ id }) => !id)
      .switchMap(({ id }) => this.treasuryService.getTreasurer(id))
      .do(data => this.setDataToForm(data))
      .delay(300)
      .subscribe(() => { this.loading = false; });
      this.treasurerDataComponent.openSidenav();
  }
  initConfigurations() {
    this.treasurer = new Treasurer();
    this.treasurer.gender = 1;
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
    moment.locale('pt');
  }

  ngOnDestroy() {
    this.formContact.reset();
    this.formPersonal.reset();
    this.formTreasurer.reset();
    this.treasurerDataComponent.closeSidenav();
  }

  setDataToForm(treasurer: Treasurer) {
    this.treasurer = treasurer;
    this.formPersonal.setValue({
        name: treasurer.name,
        churchId: treasurer.church.id,
        functionId: treasurer.function,
        dateRegister: treasurer.dateRegister,
        cpf: treasurer.cpf,
        dateBirth: treasurer.dateBirth,
        genderId: treasurer.gender
    });

    this.setPhonesValue(treasurer);
    this.formContact.setValue({
       email: treasurer.email,
       contact: treasurer.contact,
       address: treasurer.address,
       addressComplement: treasurer.addressComplement,
       cep: treasurer.cep
    });
  }

  setPhonesValue(treasurer) {
    for (let i = 0; i < treasurer.phones.length; i++) {
      const phone: Phone = treasurer.phones[i];
      if (i !== 0) {
        this.addPhone();
      }
      this.formPhones.controls[i].setValue({
        id: phone.id,
        number: phone.number,
        type: phone.type,
        isWhatsapp: phone.isWhatsapp,
        isTelegram: phone.isTelegram
      });
    }
  }

  initForm(): void {
    this.formPhones = this.formBuilder.array([this.returnPhone()]);
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      churchId: [null, Validators.required],
      functionId: [null, Validators.required],
      dateRegister: [null],
      cpf: [null],
      dateBirth: [null],
      genderId: [null]
    });
    this.formContact = this.formBuilder.group({
      email: [null],
      contact: [null],
      address: [null],
      addressComplement: [null],
      cep: [null],
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      contact: this.formContact,
    });
  }

  returnPhone() {
    return this.formBuilder.group({
      id: 0,
      number: [null],
      type: [null],
      isWhatsapp: [null],
      isTelegram: [null]
    });
  }

  addPhone() {
    const lastPhone = this.formPhones.value[this.formPhones.length - 1];
    if (lastPhone.number !== null && lastPhone.number !== '') {
      this.formPhones.push(this.returnPhone());
    }
  }

  removePhone(i: number) {
    const control = <FormArray>this.formPhones;
    control.removeAt(i);
  }

  getChurches() {
    return this.treasuryService
      .loadChurches(auth.getCurrentUnit().id)
      .do((data: Church[]) => {
        this.lstChurches = data;
      });
  }
  saveTreasurer() {
    if (!this.formTreasurer.valid) {
      return;
    }
    const treasurer = {
      ...this.formPersonal.value,
      ...this.formContact.value,
      phones: this.formPhones.value[0].number == null ? [] : this.formPhones.value,
      unitId: auth.getCurrentUnit().id,
      id: this.treasurer.id,
      identity: this.treasurer.identity
    };

    this.treasuryService.saveTreasurer(treasurer)
      .do(() => this.treasurerDataComponent.closeSidenav())
      .switchMap(() => this.treasurerDataComponent.getData())
      .do(() => this.snackBar.open('Tesoureiro salvo!', 'OK', { duration: 5000 }))
      // .takeUntil(this.onDestroyUtil$)
      .subscribe(() => {}, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
  }
  getSelectDateTime() {
    const date = this.formPersonal.get('dateRegister').value;
    if (this.dateRegisterValid()) {
      return moment(date).fromNow();
    }
  }

  dateRegisterValid() {
    if (this.formPersonal.get('dateRegister').value != null && this.formPersonal.get('dateRegister').value !== undefined) {
      return true;
    }
    return false;
  }

  maskPhone(phone) {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99) 99999-9999';
  }
}
