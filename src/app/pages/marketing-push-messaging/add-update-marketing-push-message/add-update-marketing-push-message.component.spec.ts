import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMarketingPushMessageComponent } from './add-update-marketing-push-message.component';

describe('AddUpdateMarketingPushMessageComponent', () => {
  let component: AddUpdateMarketingPushMessageComponent;
  let fixture: ComponentFixture<AddUpdateMarketingPushMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateMarketingPushMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMarketingPushMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
