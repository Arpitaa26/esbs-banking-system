import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBranchComponent } from './add-update-branch.component';

describe('AddUpdateBranchComponent', () => {
  let component: AddUpdateBranchComponent;
  let fixture: ComponentFixture<AddUpdateBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateBranchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUpdateBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
