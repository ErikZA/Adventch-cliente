import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationInformationFormComponent } from './registration-information-form.component';

describe('RegistrationInformationFormComponent', () => {
  let component: RegistrationInformationFormComponent;
  let fixture: ComponentFixture<RegistrationInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
