import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUserManagementComponent } from './staff-user-management.component';

describe('StaffUserManagementComponent', () => {
  let component: StaffUserManagementComponent;
  let fixture: ComponentFixture<StaffUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffUserManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
