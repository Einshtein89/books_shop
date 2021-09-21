import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetMainComponent } from './cabinet-main.component';

describe('CabinetMainComponent', () => {
  let component: CabinetMainComponent;
  let fixture: ComponentFixture<CabinetMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabinetMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
