import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPaymentCardComponent } from './registration-payment-card.component';

describe('RegistrationPaymentCardComponent', () => {
  let component: RegistrationPaymentCardComponent;
  let fixture: ComponentFixture<RegistrationPaymentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPaymentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPaymentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
