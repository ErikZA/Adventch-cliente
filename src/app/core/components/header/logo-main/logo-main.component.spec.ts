/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogoMainComponent } from './logo-main.component';

describe('LogoMainComponent', () => {
  let component: LogoMainComponent;
  let fixture: ComponentFixture<LogoMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
