import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'segment',
  imports: [CommonModule, FormsModule],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss',
  standalone: true
})
export class SegmentComponent implements OnChanges {
  @Input() segbuttons: { name: string; functionName: string ;tooltip?: string }[] = [];
  @Input() segmentTab: string | null = null;

  @Output() segbuttonClicked = new EventEmitter<string>();

  activeFunctionName: string | null = null;
  gridTemplateColumns = '';
  tooltip?: string;

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['segbuttons'] && this.segbuttons.length > 0) {
        this.activeFunctionName ??= this.segmentTab ? this.segmentTab: this.segbuttons[0].functionName;
        const count = this.segbuttons.length;
        this.gridTemplateColumns = `repeat(${count}, 1fr)`;
      }
    } catch (error) {
      console.error('Error in ngOnChanges:', error);
    }
  }

  onButtonClick(btn: { functionName: string }) {
    try {
      this.activeFunctionName = btn.functionName;
      this.segbuttonClicked.emit(btn.functionName);
    } catch (error) {
      console.error('Error in onButtonClick:', error);
    }
  }
}
