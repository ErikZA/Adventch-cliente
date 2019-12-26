import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDataComponent } from './budget-data.component';

describe('BudgetDataComponent', () => {
  let component: BudgetDataComponent;
  let fixture: ComponentFixture<BudgetDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
