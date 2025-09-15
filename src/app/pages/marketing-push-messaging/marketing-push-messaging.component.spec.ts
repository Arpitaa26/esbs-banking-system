import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingPushMessagingComponent } from './marketing-push-messaging.component';

describe('MarketingPushMessagingComponent', () => {
  let component: MarketingPushMessagingComponent;
  let fixture: ComponentFixture<MarketingPushMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingPushMessagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingPushMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
