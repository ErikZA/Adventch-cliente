import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchFormComponent } from './church-form.component';

describe('ChurchFormComponent', () => {
  let component: ChurchFormComponent;
  let fixture: ComponentFixture<ChurchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChurchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
