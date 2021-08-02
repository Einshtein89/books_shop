/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EntityList } from './entity-list.component';

describe('EntityList', () => {
  let component: EntityList;
  let fixture: ComponentFixture<EntityList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
