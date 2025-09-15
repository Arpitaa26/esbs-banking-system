import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferMessageComponent } from './add-transfer-message.component';

describe('AddTransferMessageComponent', () => {
  let component: AddTransferMessageComponent;
  let fixture: ComponentFixture<AddTransferMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransferMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransferMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
