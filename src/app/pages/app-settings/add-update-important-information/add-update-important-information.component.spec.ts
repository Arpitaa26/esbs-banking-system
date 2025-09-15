import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateImportantInformationComponent } from './add-update-important-information.component';

describe('AddUpdateImportantInformationComponent', () => {
  let component: AddUpdateImportantInformationComponent;
  let fixture: ComponentFixture<AddUpdateImportantInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateImportantInformationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUpdateImportantInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
