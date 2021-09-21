import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBookListComponent } from './store-book-list.component';

describe('StoreBookListComponent', () => {
  let component: StoreBookListComponent;
  let fixture: ComponentFixture<StoreBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
