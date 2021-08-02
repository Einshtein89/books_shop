import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondChildComponent } from './second-child-component.component';

describe('StoreMainComponent', () => {
  let component: SecondChildComponent;
  let fixture: ComponentFixture<SecondChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
