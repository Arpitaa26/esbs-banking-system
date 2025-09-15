import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodeComponent } from './product-code.component';

describe('ProductCodeComponent', () => {
  let component: ProductCodeComponent;
  let fixture: ComponentFixture<ProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
