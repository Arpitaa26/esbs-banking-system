import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFaqsCategoryComponent } from './add-update-faqs-category.component';

describe('AddUpdateFaqsCategoryComponent', () => {
  let component: AddUpdateFaqsCategoryComponent;
  let fixture: ComponentFixture<AddUpdateFaqsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateFaqsCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateFaqsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
