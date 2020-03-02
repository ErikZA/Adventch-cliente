import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BilletFormComponent } from './billet-form.component';

describe('BilletFormComponent', () => {
  let component: BilletFormComponent;
  let fixture: ComponentFixture<BilletFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilletFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BilletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
