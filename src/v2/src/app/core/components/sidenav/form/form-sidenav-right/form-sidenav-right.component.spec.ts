/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormSidenavRightComponent } from './form-sidenav-right.component';

describe('FormSidenavRightComponent', () => {
  let component: FormSidenavRightComponent;
  let fixture: ComponentFixture<FormSidenavRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSidenavRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSidenavRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
