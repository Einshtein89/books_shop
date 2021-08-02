import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesPerPageComponent } from './entities-per-page.component';

describe('EntitiesPerPageComponent', () => {
  let component: EntitiesPerPageComponent;
  let fixture: ComponentFixture<EntitiesPerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitiesPerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesPerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
