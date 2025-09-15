import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductApplicationDetailsComponent } from './product-application-details.component';

describe('ProductApplicationDetailsComponent', () => {
  let component: ProductApplicationDetailsComponent;
  let fixture: ComponentFixture<ProductApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductApplicationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
