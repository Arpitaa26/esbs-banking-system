import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as globals from '../../globals';
import { ApiGateWayService } from '../../services/apiGateway.service';

@Component({
  selector: 'add-sub-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header ps-3 py-2 text-light" style="background:linear-gradient(135deg, #041643, #3E5ADF);">
      <h4 class="modal-title">Configure Sub Products</h4>
      <button type="button" class="btn-close btn-close-white" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Select Sub Products to Assign</label>
        
        <div class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" (click)="selectAll()">
            Select All
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" (click)="deselectAll()">
            Deselect All
          </button>
          <button 
            type="button" 
            class="btn btn-sm text-light" 
            style="background:linear-gradient(135deg, #041643, #3E5ADF);" 
            (click)="createNewSubProduct()"
          >
            Create New Sub Product
          </button>
        </div>

        <div class="col-12 mb-2">
          <span class="text-muted small">
            {{ selectedProducts.length }} product(s) selected
          </span>
        </div>

        <div class="products-list-container" style="max-height: 125px; overflow-y: auto;">
          <div *ngFor="let product of products" class="product-item d-flex align-items-center p-2 border-bottom">
            <div class="me-3">
              <input 
                type="checkbox" 
                class="form-check-input rounded-checkbox" 
                [checked]="isSelected(product)"
                (change)="toggleSelection(product)"
                [id]="'product-' + product.products_id"
              >
            </div>
            
            <label 
              [for]="'product-' + product.products_id" 
              class="flex-grow-1 mb-0 cursor-pointer"
              style="cursor: pointer;"
            >
              <div class="fw-medium">{{ product.title || product.name }}</div>
              <div *ngIf="product.sub_title" class="text-muted small">{{ product.sub_title }}</div>
              <div class="text-muted small">
                ID: {{ product.products_id }} | 
                Status: {{ product.isactive ? 'Active' : 'Inactive' }}
              </div>
            </label>
          </div>

          <div *ngIf="products.length === 0" class="text-center py-4 text-muted">
            No unassigned sub products available
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-sm btn-danger" (click)="activeModal.dismiss()">Cancel</button>
      <button 
        type="button" 
        class="btn btn-sm text-light" 
        style="background:linear-gradient(135deg, #041643, #3E5ADF);" 
        (click)="assignSelectedProducts()" 
        [disabled]="selectedProducts.length === 0"
      >
        Assign Selected Products ({{ selectedProducts.length }})
      </button>
    </div>
  `,
  styles: [`
    .cursor-pointer {
      cursor: pointer;
    }
    .product-item:hover {
      background-color: #f8f9fa;
    }
    .products-list-container {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
    .rounded-checkbox {
      border-radius: 50% !important;
      width: 20px;
      height: 20px;
      cursor: pointer;
      border: 2px solid #6c757d;
      transition: all 0.2s ease-in-out;
    }
    .rounded-checkbox:checked {
      background-color: #041643;
      border-color: #041643;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
    }
    .rounded-checkbox:focus {
      box-shadow: 0 0 0 0.2rem rgba(4, 22, 67, 0.25);
      border-color: #041643;
    }
    .rounded-checkbox:hover:not(:checked) {
      border-color: #041643;
      background-color: #f8f9fa;
    }
    .form-check-input[type="checkbox"] {
      background-size: 12px 12px;
    }
  `]
})
export class AddSubProductModal implements OnInit {
  activeModal = inject(NgbActiveModal);
  parentProductId!: number;
  parentProductDetails: any;
  selectedProducts: any[] = [];
  products: any[] = [];
  api = inject(ApiGateWayService);

  ngOnInit() {
    this.getUnassignedSubProducts();
  }

  assignSelectedProducts() {
    if (this.selectedProducts.length > 0) {
      this.activeModal.close({
        configuredProducts: this.selectedProducts,
        parentId: this.parentProductId
      });
    }
  }

  createNewSubProduct() {
    this.activeModal.close({
      action: 'create_new',
      parentId: this.parentProductId,
      parentProduct: this.parentProductDetails
    });
  }

  getUnassignedSubProducts() {
    this.api.post(globals.getUnassignedSubProducts, {
      parentProductId: this.parentProductId
    }).subscribe({
      next: (res: any) => {
        this.products = res.data || [];
      },
      error: (err: any) => {
        console.error('Error loading unassigned sub products:', err);
        this.products = [];
      }
    });
  }

  isSelected(product: any): boolean {
    return this.selectedProducts.some(
      selected => selected.products_id === product.products_id
    );
  }

  toggleSelection(product: any) {
    if (this.isSelected(product)) {
      this.selectedProducts = this.selectedProducts.filter(
        selected => selected.products_id !== product.products_id
      );
    } else {
      this.selectedProducts = [...this.selectedProducts, product];
    }
  }

  selectAll() {
    this.selectedProducts = [...this.products];
  }

  deselectAll() {
    this.selectedProducts = [];
  }
}