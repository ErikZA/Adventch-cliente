import { Phone } from './../../../models/phone';
import { Component, OnInit, EventEmitter, OnDestroy, ViewChild, Input, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray } from '@angular/forms';
import { AuthService } from '../../../../shared/auth.service';
import { Church } from '../../../models/church';
import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs';
import { Treasurer } from '../../../models/treasurer';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { TreasurerComponent } from '../treasurer.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-treasurer-form',
  templateUrl: './treasurer-form.component.html',
  styleUrls: ['./treasurer-form.component.scss']
})

export class TreasurerFormComponent implements OnInit, OnDestroy, DoCheck {
  @Input() currentUnit: any;

  [x: string]: any;
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formPhones: FormArray;
  formContact: FormGroup;
  lstChurches: Church[] = new Array<Church>();
  subscribe1: Subscription;
  subscribe2: Subscription;
  treasurer: Treasurer = new Treasurer();
  dates = {
    now: new Date(new Date().setFullYear(new Date().getFullYear())),
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
    max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  };

  constructor(
    private authService: AuthService,
    private treasuryService: TreasuryService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public treasureComponent: TreasurerComponent,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    moment.locale('pt');
    this.currentUnit = this.authService.getCurrentUnit();
    this.treasurer.gender = 1;
    this.initForm();
    this.getChurches();
    this.subscribe2 = this.activatedRoute.params.subscribe((data) => {
      this.treasurer.gender = this.treasureComponent.treasurer.gender;
      this.editTreasurer(this.treasureComponent.treasurer);
    });
  }

  ngDoCheck() {
    if (this.authService.getCurrentUnit().id !== this.currentUnit.id) {
      this.cd.detectChanges();
      this.currentUnit = this.authService.getCurrentUnit();
      this.getChurches();
      this.formTreasurer.reset();
    }
  }

  ngOnDestroy() {
    if (this.subscribe1) { this.subscribe1.unsubscribe(); }
    if (this.subscribe2) { this.subscribe2.unsubscribe(); }
  }

  editTreasurer(treasurer: Treasurer) {
    if (treasurer.id === undefined) {
      this.formPersonal.reset();
      this.formContact.reset();
      this.formPhones.reset();
      return;
    }
    this.setPhonesValue(treasurer);
    this.formPersonal.setValue({
        name: treasurer.name,
        churchId: treasurer.church.id,
        functionId: treasurer.function,
        dateRegister: treasurer.dateRegister,
        cpf: treasurer.cpf,
        dateBirth: treasurer.dateBirth,
        genderId: treasurer.gender
    });
    this.formContact.setValue({
      email: treasurer.email,
      phones: this.formPhones,
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
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      churchId: [null, Validators.required],
      functionId: [null, Validators.required],
      dateRegister: [null],
      cpf: [null],
      dateBirth: [null],
      genderId: [null]
    });
    this.formPhones = this.formBuilder.array([this.returnPhone()]);
    this.formContact = this.formBuilder.group({
      email: [null],
      contact: [null],
      address: [null],
      addressComplement: [null],
      cep: [null],
      phones: this.formPhones,
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
    const unit = this.authService.getCurrentUnit();
    this.lstChurches = [];
    this.subscribe1 = this.treasuryService.getChurches(unit.id).subscribe((data: Church[]) => {
      this.lstChurches = Object.assign(this.lstChurches, data as Church[]);
    });
  }

  close() {
    this.treasurer = new Treasurer();
    this.treasureComponent.sidenavRight.close();
    this.router.navigate(['tesouraria/tesoureiros']);
  }

  saveTreasurer() {
    let treasurer = {
      ...this.formPersonal.value,
      ...this.formContact.value,
      unitId: this.authService.getCurrentUnit().id,
      id: this.treasureComponent.treasurer.id,
      identity: this.treasureComponent.treasurer.identity
    };
    if (treasurer.phones[0].id == null) {
      treasurer.phones[0].id = 0;
    }
    if (this.formTreasurer.valid) {
      this.treasuryService.saveTreasurer(treasurer).subscribe(() => {
        this.treasureComponent.getData();
        this.snackBar.open('Tesoureiro salvo!', 'OK', { duration: 5000 });
        this.formTreasurer.markAsUntouched();
        this.formTreasurer.reset();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
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
}
