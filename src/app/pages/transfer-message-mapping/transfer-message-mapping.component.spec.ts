import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMessageMappingComponent } from './transfer-message-mapping.component';

describe('TransferMessageMappingComponent', () => {
  let component: TransferMessageMappingComponent;
  let fixture: ComponentFixture<TransferMessageMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferMessageMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferMessageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
