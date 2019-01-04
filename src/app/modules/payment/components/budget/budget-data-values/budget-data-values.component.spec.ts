import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDataValuesComponent } from './budget-data-values.component';

describe('BudgetDataValuesComponent', () => {
  let component: BudgetDataValuesComponent;
  let fixture: ComponentFixture<BudgetDataValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetDataValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDataValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
