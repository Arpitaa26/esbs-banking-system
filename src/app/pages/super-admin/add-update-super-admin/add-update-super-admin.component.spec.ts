import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSuperAdminComponent } from './add-update-super-admin.component';

describe('AddUpdateSuperAdminComponent', () => {
  let component: AddUpdateSuperAdminComponent;
  let fixture: ComponentFixture<AddUpdateSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateSuperAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
