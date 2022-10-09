import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextTransfersComponent } from './next-transfers.component';

describe('NextTransfersComponent', () => {
  let component: NextTransfersComponent;
  let fixture: ComponentFixture<NextTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextTransfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
