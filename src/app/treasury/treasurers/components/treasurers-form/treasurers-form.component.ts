import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../shared/auth.service';
import { Church } from '../../../models/church';
import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs';
import { Treasurer } from '../../../models/treasurer';
import { MatSnackBar } from '@angular/material';
import { TreasurersComponent } from '../../treasurers.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treasurers-form',
  templateUrl: './treasurers-form.component.html',
  styleUrls: ['./treasurers-form.component.scss']
})

export class TreasurersFormComponent implements OnInit {
  [x: string]: any;
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formContact: FormGroup;
  lstChurches: Church[] = new Array<Church>();
  subscribe1: Subscription;
  treasurer: Treasurer = new Treasurer();

  constructor(
    private authService: AuthService,
    private treasuryService: TreasuryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public treasureComponent: TreasurersComponent) { }

  ngOnInit() {
    this.initForm();
    this.getChurches();
    this.editTreasurer(this.treasureComponent.treasurer);
  }

  editTreasurer(treasurer){
    if(treasurer.id == undefined)
      return;
    this.formPersonal.setValue({
        name: treasurer.name,
        church: treasurer.church.id,
        role: treasurer.function,
        registrationDate: treasurer.dateRegister,
        cpf: treasurer.cpf,
        phone: treasurer.phone,
        gender: treasurer.gender
    });

    this.formContact.setValue({
      email: treasurer.email,
      birthday: treasurer.dateBirth,
      preferentialContact: treasurer.contact,
      address: treasurer.address,
      complement: treasurer.addressComplement,
      cep: treasurer.cep
    });
  }

  initForm(): void {
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      church: [null, Validators.required],
      role: [null, Validators.required],
      registrationDate: [null],
      cpf: [null],
      phone: [null],
      gender: [null]
    });
    this.formContact = this.formBuilder.group({
      email: [null],
      birthday: [null],
      preferentialContact: [null],
      address: [null],
      complement: [null],
      cep: [null]
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      contact: this.formContact,
    });
  }

  getChurches(){    
    var unit = this.authService.getCurrentUnit();
    this.subscribe1 = this.treasuryService.getChurches(unit.id).subscribe((data: Church[]) =>{
      this.lstChurches = Object.assign(this.lstChurches, data as Church[]);
    });
  }

  close() {
    this.treasurer = new Treasurer();
    //if (this.treasureComponent && this.treasureComponent.sidenavRight.opened){
      this.treasureComponent.sidenavRight.close();
    //}
    this.router.navigate(['treasury/treasurers']);
  }

  saveTreasurer(){
    let body = JSON.stringify({
      name: this.formPersonal.value.name,
      churchId: this.formPersonal.value.church,
      functionId: this.formPersonal.value.role,
      dateRegister: this.formPersonal.value.registrationDate,
      phone: this.formPersonal.value.phone,
      genderId: this.formPersonal.value.gender,
      cpf: this.formPersonal.value.cpf,
      address: this.formContact.value.address,
      dateBirth: this.formContact.value.birthday,
      cep: this.formContact.value.cep,
      addressComplement: this.formContact.value.complement,
      email: this.formContact.value.email,
      contact: this.formContact.value.preferentialContact,
      unitId: this.authService.getCurrentUnit().id
    });
    this.treasuryService.saveNewTreasurer(body)
    .then((data: any) => {
      this.snackBar.open('Tesoureiro cadastrado!', 'OK', { duration: 10000 });
      this.formPersonal.reset();
      this.formContact.reset();
      this.formTreasurer.reset();
      this.navService.toggleSideNav();
    });
  }
}
