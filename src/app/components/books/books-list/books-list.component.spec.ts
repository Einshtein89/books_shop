import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksList } from './books-list.component';

describe('BooksList', () => {
  let component: BooksList;
  let fixture: ComponentFixture<BooksList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
