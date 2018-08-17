import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliationFormComponent } from './avaliation-form.component';

describe('AvaliationFormComponent', () => {
  let component: AvaliationFormComponent;
  let fixture: ComponentFixture<AvaliationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
