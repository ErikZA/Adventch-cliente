import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDynamicFormComponent } from './login-dynamic-form.component';

describe('LoginDynamicFormComponent', () => {
  let component: LoginDynamicFormComponent;
  let fixture: ComponentFixture<LoginDynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDynamicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
