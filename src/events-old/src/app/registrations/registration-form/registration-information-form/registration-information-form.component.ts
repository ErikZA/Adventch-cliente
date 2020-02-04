import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-information-form',
  templateUrl: './registration-information-form.component.html',
  styleUrls: ['./registration-information-form.component.scss']
})
export class RegistrationInformationFormComponent implements OnInit {
  @Input() identificationForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
