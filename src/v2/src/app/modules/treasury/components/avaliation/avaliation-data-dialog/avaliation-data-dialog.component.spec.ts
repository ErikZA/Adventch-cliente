import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliationDataDialogComponent } from './avaliation-data-dialog.component';

describe('AvaliationDataDialogComponent', () => {
  let component: AvaliationDataDialogComponent;
  let fixture: ComponentFixture<AvaliationDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliationDataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliationDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
