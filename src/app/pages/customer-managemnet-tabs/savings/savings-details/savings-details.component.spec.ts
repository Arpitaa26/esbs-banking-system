import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsDetailsComponent } from './savings-details.component';

describe('SavingsDetailsComponent', () => {
  let component: SavingsDetailsComponent;
  let fixture: ComponentFixture<SavingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
