import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: true
})
export class PaginationComponent {
  @Input() pagination!: Pagination;
  @Input() color: string = 'primary';
  @Input() small: boolean = false;
  @Input() large: boolean = false;
  @Output() clickBeginning = new EventEmitter<void>();
  @Output() clickPrevious = new EventEmitter<void>();
  @Output() clickNext = new EventEmitter<void>();
  @Output() clickEnd = new EventEmitter<void>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  showRowCount = false;

  toggle(): void {
    this.showRowCount = !this.showRowCount;
  }

  get currentPageItemsMin(): number {
    return Math.max(1, (this.pagination.page - 1) * this.pagination.pageSize + 1);
  }

  get currentPageItemsMax(): number {
    return Math.min(this.pagination.page * this.pagination.pageSize, this.maxItems);
  }

  get maxItems(): number {
    return this.pagination.rowCount;
  }

  get currentPage(): number {
    return this.pagination.page;
  }

  get totalPages(): number {
    return this.pagination.pageCount;
  }

  getButtonClasses() {
    return {
      small: this.small,
      large: this.large,
      [this.color]: true 
    };
  }
  
  changePageSize(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    if (newSize !== this.pagination.pageSize) {
      this.pagination.pageSize = newSize;
      this.pageSizeChanged.emit(newSize);
    }
  }
}
export interface Pagination {
  page: number;
  pageSize: number;
  rowCount: number;
  pageCount: number;
}
