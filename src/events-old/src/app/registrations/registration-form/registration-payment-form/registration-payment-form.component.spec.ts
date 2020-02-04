import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPaymentFormComponent } from './registration-payment-form.component';

describe('RegistrationPaymentFormComponent', () => {
  let component: RegistrationPaymentFormComponent;
  let fixture: ComponentFixture<RegistrationPaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPaymentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
