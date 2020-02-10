import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliationObservationFormComponent } from './avaliation-observation-form.component';

describe('AvaliationObservationFormComponent', () => {
  let component: AvaliationObservationFormComponent;
  let fixture: ComponentFixture<AvaliationObservationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliationObservationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliationObservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
