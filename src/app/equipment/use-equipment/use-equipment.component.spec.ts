import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseEquipmentComponent } from './use-equipment.component';

describe('UseEquipmentComponent', () => {
  let component: UseEquipmentComponent;
  let fixture: ComponentFixture<UseEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseEquipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
