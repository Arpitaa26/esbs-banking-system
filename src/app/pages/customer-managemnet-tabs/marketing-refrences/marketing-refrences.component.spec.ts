import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingRefrencesComponent } from './marketing-refrences.component';

describe('MarketingRefrencesComponent', () => {
  let component: MarketingRefrencesComponent;
  let fixture: ComponentFixture<MarketingRefrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingRefrencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingRefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
