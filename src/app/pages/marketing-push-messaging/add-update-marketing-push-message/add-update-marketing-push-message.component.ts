import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import * as globals from 'app/globals';
import Quill from 'quill';
import { ToastrService } from 'app/services/toastr.service';


@Component({
  selector: 'app-add-update-marketing-push-message',
  standalone: true,
  imports: [CommonModule, FormsModule, SegmentComponent],
  templateUrl: './add-update-marketing-push-message.component.html',
  styleUrls: ['./add-update-marketing-push-message.component.scss'],
})
export class AddUpdateMarketingPushMessageComponent implements AfterViewInit {
  @ViewChild('titleCtrl') titleCtrl!: NgModel;
  @ViewChild('bodyCtrl') bodyCtrl!: NgModel;
  is_new_msg: boolean = false;
  quillEditor: Quill | undefined;
  previewHtml: any;
  deviceType: string = 'ios';
  isReadOnly: boolean = false;
  showAuthoriserButtons: boolean = false;
  showComplianceButtons: boolean = false;
  showSaveChanges: boolean = false;
  clickOnSave: boolean = false;
  message: any = {
    title: '',
    body: '',
    actions: [],
    messagebutton: [],
  };

  isFieldsValid: any = { title: true, body: true };

  showActionModal = false;
  actionForm = {
    title: '',
    type: '',
    value: '',
  };
  editIndex: number | null = null;
  segbuttonConfig = [
    { name: 'iOS', functionName: 'ios' },
    { name: 'Android', functionName: 'android' },
  ];
  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer,
    private api: ApiGateWayService,
    public gps: GlobalProviderService,
    private toastr: ToastrService
  ) {
    const data = this.router.getCurrentNavigation()?.extras?.state?.['messageData'];
    if (!data && this.router.getCurrentNavigation()?.extras?.state?.['is_new_msg']) { this.is_new_msg = true; }
    if (data) {
      this.message = {
        ...data,
        actions: [],
      };
      this.isReadOnly = true;
      setTimeout(() => {
        if (data.status === 'Drafted') {
          this.showAuthoriserButtons = true;
        } else if (data.status === 'Compliance_Approved') {
          this.showComplianceButtons = true;
        }
        if (data.status === 'Compliance_Rejected') {
          this.isReadOnly = false;
          this.showSaveChanges = true;
        }
        if (data.status === 'Authoriser_Rejected') {
          this.isReadOnly = false;
          this.showSaveChanges = true;
        }
        if (data.status === 'Authoriser_Approved') {
          this.isReadOnly = false;
          this.showSaveChanges = true;
        }
      });
      setTimeout(() => {
        this.message.body = this.message.message || '';
        this.updatePreview();
      }); this.api.post(globals.getCustomerByMessagesIdEndpoint, { pushmessages_id: data.pushmessages_id }).subscribe({
        next: (res) => {
          console.log("Customer data fetched:", res);
        },
        error: (err) => {
          console.error('Error calling getCustomerByMessageId:', err);
        }
      });
      if (Array.isArray(data.messagebutton)) {
        this.message.actions = data.messagebutton;
      } else if (typeof data.messagebutton === 'string') {
        try {
          this.message.actions = JSON.parse(data.messagebutton);
        } catch {
          this.message.actions = [];
        }
      } else {
        this.message.actions = [];
      }
    } else {
      this.message = {
        id: new Date().getTime().toString(),
        title: '',
        message: '',
        messagebutton: [],
        mode: 0,
        actions: [],
        bullets: [],
        date: new Date().toISOString(),
        bannerurl: null,
        bannerurl2: null,
        isactive: 1,
        isdrafted: 1,
        user_id: this.gps.usersID,
        user_roles_id: this.gps.usersRoleID,
        status: 'Drafted',
        visibility: 'all',
        createdby: this.gps.usersID,
        create_date: new Date(),
        modified_date: new Date(),
        modifiedby: this.gps.usersID,
        lastedit: this.gps.usersID,
        pushmessages_id: ""
      };
      this.isReadOnly = false;
    }
  }

  ngAfterViewInit(): void {
    this.quillEditor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });
    if (this.quillEditor && this.message.message) {
      this.quillEditor.root.innerHTML = this.message.message;
      this.message.body = this.message.message;
      this.updatePreview();
    }
    this.quillEditor.enable(!this.isReadOnly);
    this.updatePreview();
    this.quillEditor.on('text-change', () => {
      const html = this.quillEditor?.root.innerHTML;
      this.message.message = html;
      this.isFieldsValid.body = true;
      this.updatePreview();
    });
    this.updatePreview();
  }


  back() {
    this.router.navigate(['/marketing-push-messaging'], {
      state: { openTab: this.isReadOnly ? 'drafted_messages' : 'active_messages' },
    });
  }

  changeValidity(field: string) {
    this.isFieldsValid[field] = true;
  }

  private runValidations(): boolean {
    this.clickOnSave = true;

  
  if (!this.message.title?.trim()) {
    this.isFieldsValid.title = false;
    this.toastr.error('Title is required.');
    return false;
  } else {
    this.isFieldsValid.title = true;
  }

if (this.quillEditor) {
      this.message.body = this.quillEditor.root.innerHTML;
      const text = this.quillEditor.getText().trim();
      if (!text || text === '') {
        this.isFieldsValid.body = false;
        this.toastr.error('Body is required.');
        return false;
      } else {
        this.isFieldsValid.body = true;
      }
    }
    return true;

  }


  saveChanges() {
    if (!this.runValidations()) {
      return;
    }
    let payload = {
      ...this.message,
      // status: 'Drafted',
      // isdrafted: 1,
      // isactive: 1,
      modifiedby: this.gps.usersID,
      user_id: this.gps.usersID,
      user_roles_id: this.gps.usersRoleID,
      messagebutton: JSON.stringify(this.message.actions || []),
    };
    let url = this.is_new_msg ? globals.addMessageEndpoint : globals.updateMessageEndpoint;
    this.api.post(url, payload).subscribe({
      next: () => {
        this.toastr.success('Changes saved and message moved to Drafted');
        this.router.navigate(['/marketing-push-messaging'], {
          state: { openTab: 'drafted_messages' },
        });
      },
      error: () => {
        this.toastr.error('Failed to save changes');
      },
    });
  }

  seghandleClick(functionName: string) {
    this.deviceType = functionName;
    this.updatePreview();
  }

  updatePreview() {
    const title = this.message.title ? `<h1>${this.message.title}</h1>` : `<h1>Default Title</h1>`;
    const body = this.message.body ? `<p>${this.message.body}</p>` : `<p>Default Description</p>`;
    let buttons = '';
    if (this.message.actions?.length) {
      for (let btn of this.message.actions) {
        if (this.deviceType === 'ios') {
          buttons += `<button style="
            margin: 5px; padding: 5px 10px; 
            border-radius: 15px; 
            background-color: #007AFF; 
            color: white; 
            border: none;
            font-weight: 600;
          ">${btn.title}</button>`;
        } else {
          buttons += `<button style="
            margin: 5px; padding: 5px 10px; 
            border-radius: 2px; 
            background-color: #3DDC84; 
            color: white; 
            border: none;
            font-weight: 600;
          ">${btn.title}</button>`;
        }
      }
    } else {
      buttons = `
        <button style="margin: 5px; padding: 5px 10px; border-radius: 15px; background-color: #007AFF; color: white; border: none; font-weight: 600;">Apply Now</button>
        <button style="margin: 5px; padding: 5px 10px; border-radius: 15px; background-color: #007AFF; color: white; border: none; font-weight: 600;">Learn More</button>
      `;
    }
    const html = this.generatePreviewHtml(title, body, buttons);
    this.previewHtml = this.domSanitizer.bypassSecurityTrustHtml(html);
  }
  private generatePreviewHtml(title: string, body: string, buttons: string): string {
    return `
    <html>
      <head>
        <style>
          @font-face {
            font-family: 'muli';
            src: url(assets/fonts/Mulish-ExtraLight.ttf);
          }
          body {
            background-color: white;
            color: black;
            margin: 0;
            font-family: 'muli', sans-serif;
          }
        /* Status Bar styles */
          .status-bar {
            display: flex;
            justify-content: space-between;
            padding: 5px 15px;
            font-size: 14px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #ddd;
          }
          .status-bar .time {
            font-weight: 600;
          }
          .status-bar .icons span {
            margin-left: 8px;
          }
        /* Logo */
          .logo-container {
            text-align: center;
            margin: 15px 0;
          }
          .logo-container img {
            width: 50px;
            height: 50px;
            object-fit: contain;
          }
        /* Content Card */
          .content {
            padding: 15px;
            max-width: 360px;
            margin: 0 auto;
          }
          .card {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 40px;
          }
          h1 {
            font-weight: 700;
            font-size: 1.5rem;
            margin: 0 0 8px 0;
          }
          h5 {
            margin: 0 0 15px 0;
            font-weight: 500;
            color: #555;
          }
          p {
            font-size: 1rem;
            line-height: 1.4;
            color: #333;
          }
          button {
            margin: 5px 8px 0 0;
            padding: 8px 16px;
            border-radius: 20px;
            border: none;
            font-weight: 600;
            cursor: pointer;
          }
        /* Tab bar bottom */
          .tab-bar {
            position: fixed;
            bottom: 0;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            display: flex;
            justify-content: space-around;
            background: #f8f8f8;
            border-top: 1px solid #ddd;
            padding: 8px 0;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
            font-size: 12px;
            color: #333;
          }
          .tab-bar div {
            text-align: center;
            flex: 1;
          }
          .tab-bar img {
            max-width: 25px;
            margin-bottom: 4px;
          }
        </style>
      </head>
      <body>
      <!-- Status Bar -->
        <div class="status-bar">
          <div class="time">9:41 AM</div>
          <div class="icons">
            <span>📶</span>
            <span style="transform: rotate(90deg); font-size: 18px;">🔋</span>
          </div>
        </div>
      <!-- Logo -->
        <div class="logo-container">
          <img src="/image/small-logo.png" alt="Logo" />
        </div>
      <!-- Content -->
        <div class="content">
          <div class="card">
            ${title}
            
            ${body}
            <div>${buttons}</div>
          </div>
        </div>
      <!-- Tab Bar -->
        <div class="tab-bar">
          <div>
            <img src="/image/home_tab_outline.png" alt="Home" />
            <div>Home</div>
          </div>
          <div>
            <img src="/image/product_tab_outline.png" alt="Products" />
            <div>Products</div>
          </div>
          <div>
            <img src="/image/transfer_tab_outline.png" alt="Transfer" />
            <div>Transfer</div>
          </div>
          <div>
            <img src="/image/more_tab_outline.png" alt="More" />
            <div>More</div>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  openActionModal() {
    this.actionForm = { title: '', type: '', value: '' };
    this.showActionModal = true;
  }

  closeActionModal() {
    this.showActionModal = false;
    this.editIndex = null;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  showNumberHint() {
    if (this.actionForm.type === 'Call Number') {
      this.toastr.info('Please enter a valid 10-digit number');

    }
  }

  addAction() {
  
  if (!this.actionForm.title || !this.actionForm.type || (this.actionForm.type !== 'Call Back' && !this.actionForm.value)) {
    this.toastr.error('Please fill all action fields');
    return;
  }

  if (this.actionForm.type === 'Call Number') {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.actionForm.value)) {
      this.toastr.error('Please enter a valid 10-digit phone number');
      return;
    }
  }

  const newAction = {
    title: this.actionForm.title,
    type: this.actionForm.type,
    value: this.actionForm.value,
    action: this.actionForm.value,
  };

  if (this.editIndex !== null) {
    this.message.actions[this.editIndex] = newAction;
  } else {
    this.message.actions.push(newAction);
  }

  this.updatePreview();
  this.closeActionModal();
}


  editAction(index: number) {
    const btn = this.message.actions[index];
    this.actionForm = { ...btn };
    this.showActionModal = true;
    this.editIndex = index;
  }

  deleteAction(index: number) {
    this.message.actions.splice(index, 1);
    this.updatePreview();
  }

  approveAsAuthoriser() {
    const payload = {
      ...this.message,
      status: 'Compliance_Approved',
      isdrafted: 1,
      isactive: 0,
      mode: 0
    };
    this.sendUpdateToBackend(payload);
  }

  rejectAsAuthoriser() {
    const payload = {
      ...this.message,
      status: 'Compliance_Rejected',
      isdrafted: 1,
      isactive: 0,
      mode: 0
    };
    this.isReadOnly = false;
    this.showAuthoriserButtons = false;
    this.showComplianceButtons = false;
    this.quillEditor?.enable(true);
    this.sendUpdateToBackend(payload);
  }

  approveAsCompliance() {
    const payload = {
      ...this.message,
      user_roles_id: this.gps.usersRoleID,
      user_id: this.gps.usersID,
      modifiedby: this.gps.usersID,
      lastedit: this.gps.usersID,
      create_date: new Date(),
      status: 'Authoriser_Approved',
      isdrafted: 0,
      isactive: 0,
      mode: 1,
      messagebutton: JSON.stringify(this.message.actions || []),
      actions: this.message.actions || []
    };
    this.sendUpdateToBackend(payload);
  }

  rejectAsCompliance() {
    const payload = {
      ...this.message,
      status: 'Authoriser_Rejected',
      isdrafted: 0,
      isactive: 0,
      mode: 0,
      lastedit: this.gps.usersID,
    };
    this.isReadOnly = false;
    this.showAuthoriserButtons = false;
    this.showComplianceButtons = false;
    this.quillEditor?.enable(true);
    this.sendUpdateToBackend(payload);
  }

  sendUpdateToBackend(payload: any) {
    payload.user_roles_id = this.gps.usersRoleID;
    payload.user_id = this.gps.usersID;
    payload.modifiedby = this.gps.usersID;
    payload.lastedit = this.gps.usersID;
    payload.create_date = new Date(),
      this.api.post(globals.updateMessageEndpoint, payload).subscribe({
        next: (res) => {
          this.toastr.success('Status updated successfully');
          this.router.navigate(['/marketing-push-messaging'], {
            state: { openTab: 'active_messages', reload: true }
          });
        },
        error: () => {
          this.toastr.error('Failed to update status');
        },
      });
  }
}
