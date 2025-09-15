import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-button',
  imports: [CommonModule, FormsModule,],
  standalone: true,
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss'
})
export class UploadButtonComponent {
  @ViewChild('nativefilebutton', { static: false }) nativeInputBtn!: ElementRef<HTMLInputElement>;

  @Input() public options: any = {
    title: "Upload",
    type: "csv", // image, csv, json, etc.
    btnType: 'clear', // clear, round (custom styles)
    btnSize: 'small', // small, large (custom styles)
    btnColor: 'primary', // custom class or material theme color
    btnCallback: (data: any) => { } // callback function
  };
  constructor(private renderer: Renderer2) { }

  public callback(event: Event): void {
    this.nativeInputBtn.nativeElement.click();
  }

  public filesAdded(event: Event): void {
    try {
      const fileInput = this.nativeInputBtn.nativeElement;
      const files: FileList | null = fileInput.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const clearInput = () => { fileInput.value = ''; };
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (!result) {
          this.options.btnCallback(null);
          return;
        }
        const base64Index = result.indexOf('base64,');
        const content = base64Index >= 0 ? atob(result.substring(base64Index + 7)) : result;
        clearInput();
        this.options.btnCallback(content);
      };
      switch (this.options.type) {
        case 'image':
          if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
          } else {
            this.options.btnCallback(null);
          }
          break;
        case 'csv':
        case 'json':
        default:
          reader.readAsDataURL(file);
          break;
      }
    } catch (error) {
      console.error('Error in filesAdded:', error);
      this.options.btnCallback(null);
    }
  }
}

