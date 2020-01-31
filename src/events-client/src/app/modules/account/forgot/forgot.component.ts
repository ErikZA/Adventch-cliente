import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  public formForgot: FormGroup;

  constructor(
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formForgot = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    })
  }

}
