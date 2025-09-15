import { stopapi } from './../../globals';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SegmentComponent } from 'app/components/segment/segment.component';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import Quill from 'quill';
import * as globals from '../../globals';
import { GlobalProviderService } from 'app/services/global-provider.service';

@Component({
  selector: 'app-stop',
  imports: [SegmentComponent, CommonModule, FormsModule],
  templateUrl: './stop.component.html',
  styleUrl: './stop.component.scss'
})
export class StopComponent {
 segbuttonConfig: any = [
    { name: 'App & Online', functionName: 'app_online' },
    { name: 'Phoebus API Unavailable', functionName: 'soopra_api' }
  ];

  currentTab: string = 'app_online';

  messageText: string = 'Our system is under maintenance, currently, we are not able to continue your request, sorry for the inconvenience';
  messageTextOnline: string = 'Maintenance!!!';

  message: any = {};
  quillEditor: Quill | undefined;
  quillInitialized = false;
  previewHtml: any;
  enableapi: boolean = false;
  sopra_status: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiGateWayService,
    private domSanitizer: DomSanitizer,
    private gps: GlobalProviderService
  ) {
    this.message = {
      id: new Date().getTime().toString(),
      title: '',
      body: '',
      actions: [],
      bullets: null,
      css: '',
      type: 'system',
      date: new Date(),
      target: null,
      total: '',
      delivered: 0,
      viewed: 0,
      interested: 0,
      visibility: 'all',
      status: 'new',
      productId: null,
      messagebutton: [],
      pushmessages_id: '',
      isactive: 1,
      message: '',
    };
    this.updatePreview();

    const data = this.router.getCurrentNavigation()?.extras?.state?.['messageData'];
    if (data) {
      this.message = data;
    }
  }

  seghandleClick(data: any) {
    this.currentTab = data;
    if (data === 'app_online') {
      this.quillInitialized = false;
    }
  }

  handleStop() {
    // Optional: Your logic goes here (API calls etc.)
    const payload = {
      enableapi: this.enableapi,
      stopReason: this.quillEditor?.getText().trim(),
      stopTitle: this.message.title
    }

    const now = new Date();

    const month = now.getMonth() + 1; // getMonth() is 0-indexed
    const day = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const customFormattedTime = `${month}/${day}/${year} ${hours}:${formattedMinutes}${ampm}`;

    const txt = this.enableapi? 'stop' : 'start';
    let message = `Username ${this.gps.userEmailID} clicked on  ${txt}  api services button on ${customFormattedTime}`;
    let auditData = {
          users_id: this.gps.usersID,
          customer_devices_id: 0,
          usertype: "staff",
          uuid: "",
          appname: "hub",
          event_type: "view",
          screen: "user",
          trail_details: message,
      };

    this.apiService.post(globals.stopapi, payload).subscribe({
      next: (response: any) => {
      },
      error: err => console.error('Error loading messages:', err)
    });

    this.apiService.post(globals.loadAudit, auditData).subscribe({
      next: (response: any) => {
      },
      error: err => console.error('Error loading messages:', err)
    });

    this.enableapi = !this.enableapi;
  }

  handleStopSopra() {
    // Optional: Your logic goes here (API calls etc.)
    const payload = {
      mode: 1,
      sopra_status: this.sopra_status,
      sopramsg: this.messageText
    }

    const now = new Date();

    const month = now.getMonth() + 1; // getMonth() is 0-indexed
    const day = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const customFormattedTime = `${month}/${day}/${year} ${hours}:${formattedMinutes}${ampm}`;

    const txt = this.sopra_status == 0? 'stop' : 'start';
    let message = `Username ${this.gps.userEmailID} clicked on ${txt} RPA Bot services button on ${customFormattedTime}`;
    let auditData = {
      users_id: this.gps.usersID,
      customer_devices_id: 0,
      usertype: "staff",
      uuid: "",
      appname: "hub",
      event_type: "view",
      screen: "user",
      trail_details: message,
  };

  this.apiService.post(globals.stopsopraapi, payload).subscribe({
    next: (response: any) => {
    },
    error: err => console.error('Error loading messages:', err)
  });

  this.apiService.post(globals.loadAudit, auditData).subscribe({
    next: (response: any) => {
    },
    error: err => console.error('Error loading messages:', err)
  });

    this.sopra_status = this.sopra_status == 0 ? 1 : 0;
  }

  ngAfterViewChecked(): void {
    if (this.currentTab === 'app_online' && !this.quillInitialized) {
      const container = document.getElementById('editor-container');
      if (container && container.children.length === 0) {
        this.initQuillEditor();
      }
    }
  }

  initQuillEditor() {
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
          ['clean']
        ]
      }
    });

    if (this.message.message) {
      this.quillEditor.root.innerHTML = this.message.message;
    }

    this.quillEditor.on('text-change', () => {
      const html = this.quillEditor?.root.innerHTML;
      this.message.message = html;
      this.updatePreview();
    });

    this.quillInitialized = true;
  }

  updatePreview() {
    var color = "black";
    var title = "";
    if (this.message.title) {
      title = `<h1>${this.message.title}</h1>`;
    }
    var body = "";
    if (this.message.message) {
      body = `<p>${this.message.message}</p>`;
    }
    var buttons = "";
    if (this.message.messagebutton !== null) {
      for (let i in this.message.messagebutton) {
        buttons += `
            <button ion-button small round>${this.message.messagebutton[i].title}</button>
          `;
      }
    }
    var ionitem = "";
    if (this.message.bullets !== null) {
      for (let k in this.message.bullets) {
        ionitem += `
            <li>${this.message.bullets[k].bulletline}</li>
          `;
      }
    }
    this.previewHtml = this.domSanitizer.bypassSecurityTrustHtml(`
      <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
          <style>
            body {
              background-color: white;
              color: black;
              margin: 0px;
              font-family: 'muli';
            }

            .nav-bar {
              position: fixed;
              height: 60px;
              background-color: #fefefe;
              text-align: center;
              border-bottom: 1px solid #ccc;
            }

            .logo {
              height: 60%;
              width: auto;
            }

            .content {
              position: fixed;
              height: 438px;
              overflow: scroll;
              margin-top: 60px;
              min-width: 300px;
            }

            .tab-bar {
              position: fixed;
              bottom: 0px;
              height: 50px;
              background-color: ${color};
              width: 100%;
              display: flex;
              justify-content: space-around;
              align-items: center;
            }

            .tab {
              width: 79px;
              height: 100%;
              text-align: center;
              position: relative;
            }

            .tab .bi {
              font-size: 1.4em;
              color: white;
              margin-top: 6px;
              display: block;
            }

            .tab-title {
              font-size: 0.7em;
              color: white;
            }

            .padding {
              padding: 10px;
            }

            .card {
              border: 1px solid #dedede;
              overflow: hidden;
            }

            .list {
              background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 20'><path d='M2,20l-2-2l8-8L0,2l2-2l10,10L2,20z' fill='%23c8c7cc'/></svg>");
              padding-right: 32px;
              background-position: right 14px center;
              background-repeat: no-repeat;
              background-size: 14px 14px;
              padding-left: 10px;
              padding: 14px;
              border: 1px solid #efefee;
              margin-bottom: 20px;
            }

            h1, h2, p {
              color: ${color};
            }

            div.card h1 {
              font-size: 1.5em;
              font-weight: bold;
            }

            h2 {
              font-size: 1.2em;
              font-weight: bold;
            }

            div.list h1 {
              font-size: 1.1em;
              font-weight: bold;
            }

            button {
              padding: 5px;
              border-radius: 10px;
              background-color: ${color};
              color: white;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="status-bar d-flex" style="display: flex;">
            <span class="time" style="margin-left: 5%; margin-top: 2%; width: 50%;">3:33 AM</span>
            <div class="icons" style="margin-left: auto; margin-right: 5%; margin-top: 1%; display: inline-flex;">
              <span class="status-bar-icon" style="font-size: 14px; padding-top: 3px; padding-right: 3px;">📶</span>
              <span class="status-bar-icon battery-landscape" style="display: inline-block; transform: rotate(90deg); font-size: 23px;">🔋</span>
            </div>
          </div>

          <div class="row justify-content-center">
            <img class="logo" src="/image/small-logo.png" style="width: 50px; height: 50px; margin: 10px auto; display: block;">
          </div>

          <div class="content padding">
            Preview List:
            <div class="list">
              ${title}
            </div>
            Full View:
            <div class="card padding">
              ${title}
              ${body}
              <ul>
                ${ionitem}
              </ul>
              ${buttons}
            </div>
          </div>

          <div class="tab-bar">
            <div class="tab">
              <i class="bi bi-cash-coin"></i>
              <div class="tab-title">Accounts</div>
            </div>
            <div class="tab">
              <i class="bi bi-geo-alt-fill"></i>
              <div class="tab-title">Near Me</div>
            </div>
            <div class="tab">
              <i class="bi bi-file-ppt-fill"></i>
              <div class="tab-title">Products</div>
            </div>
            <div class="tab">
              <i class="bi bi-envelope-open-fill"></i>
              <div class="tab-title">Messages</div>
            </div>
            <div class="tab">
              <i class="bi bi-gear-wide-connected"></i>
              <div class="tab-title">Settings</div>
            </div>
          </div>
        </body>
      </html>
    `);
  }
}
