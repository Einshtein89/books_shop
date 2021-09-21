import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAuthorizationComponent } from './cart-authorization.component';

describe('CartAuthorizationComponent', () => {
  let component: CartAuthorizationComponent;
  let fixture: ComponentFixture<CartAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
