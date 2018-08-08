import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { auth } from '../../../auth';

@Component({
  selector: 'app-login-dynamic-form',
  templateUrl: './login-dynamic-form.component.html',
  styleUrls: ['./login-dynamic-form.component.scss']
})
export class LoginDynamicFormComponent implements OnInit {

  @Input()
  loginName = 'Email';

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<{ login: string, password: string, remember: boolean }>();

  hide = true;
  form: FormGroup;
  remember = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    const login = auth.getLastLogin();
    this.form = this.formBuilder.group({
      login: [login ? login : null, [Validators.required]],
      password: [null, Validators.required]
    });
    this.loading = true;
  }

  public rememberMe(remember: boolean): void {
    this.remember = remember;
  }

  public login(): void {
    if (this.form.valid) {
      this.submitted.emit({...this.form.value, remember: this.remember });
    }
  }
}
