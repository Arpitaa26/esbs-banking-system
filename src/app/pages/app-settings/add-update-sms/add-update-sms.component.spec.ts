import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSmsComponent } from './add-update-sms.component';

describe('AddUpdateSmsComponent', () => {
  let component: AddUpdateSmsComponent;
  let fixture: ComponentFixture<AddUpdateSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateSmsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddUpdateSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
