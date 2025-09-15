import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsMessagesDetailsComponent } from './contact-us-messages-details.component';

describe('ContactUsMessagesDetailsComponent', () => {
  let component: ContactUsMessagesDetailsComponent;
  let fixture: ComponentFixture<ContactUsMessagesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsMessagesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsMessagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
