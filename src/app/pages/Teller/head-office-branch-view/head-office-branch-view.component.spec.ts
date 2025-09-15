import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadOfficeBranchViewComponent } from './head-office-branch-view.component';

describe('HeadOfficeBranchViewComponent', () => {
  let component: HeadOfficeBranchViewComponent;
  let fixture: ComponentFixture<HeadOfficeBranchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadOfficeBranchViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadOfficeBranchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
