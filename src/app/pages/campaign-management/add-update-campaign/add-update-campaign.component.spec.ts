import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCampaignComponent } from './add-update-campaign.component';

describe('AddUpdateCampaignComponent', () => {
  let component: AddUpdateCampaignComponent;
  let fixture: ComponentFixture<AddUpdateCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateCampaignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
