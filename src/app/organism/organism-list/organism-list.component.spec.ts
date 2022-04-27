import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismListComponent } from './organism-list.component';

describe('OrganismListComponent', () => {
  let component: OrganismListComponent;
  let fixture: ComponentFixture<OrganismListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganismListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
