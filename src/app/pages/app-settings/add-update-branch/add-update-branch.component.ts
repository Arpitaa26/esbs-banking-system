import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiGateWayService } from 'app/services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
import * as globals from 'app/globals';

@Component({
  selector: 'app-add-update-branch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-branch.component.html',
  styleUrl: './add-update-branch.component.scss'
})
export class AddUpdateBranchComponent implements OnInit {
  branch: any = {
    name: '',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    address_line4: '',
    tel: '',
    fax: '',
    email: '',
    postalcode: '',
    latitude: '',
    longitude: '',
    opening_hours: []
  };

  isEditMode = false;
  newOpeningDay = '';
  newOpeningHours = '';
  confirmDeleteIndex: number | null = null;
  mapUrl: SafeResourceUrl | null = null;
  phoneValidationError = '';
  faxValidationError = '';
  emailValidationError = '';
  openingHoursValidationError = '';

  constructor(
    private router: Router,
    private api: ApiGateWayService,
    private sanitizer: DomSanitizer,
    private gps: GlobalProviderService
  ) { }

  ngOnInit(): void {
    const data = history.state?.branchData;
    if (data && Object.keys(data).length > 0) {
      this.isEditMode = true;
      this.branch = {
        ...data,
        opening_hours: Array.isArray(data.opening_hours)
          ? data.opening_hours.map((item: any) => ({
            day: item.day || item.days || '',
            hours: item.hours || ''
          }))
          : []
      };
    } else {
      this.isEditMode = false;
    }
    if (
      this.branch.address_line1 ||
      this.branch.address_line2 ||
      this.branch.address_line3 ||
      this.branch.address_line4
    ) {
      this.updateMapUrlFromAddress();
    }
  }

  updateMapUrlFromAddress() {
    const { latitude, longitude } = this.branch;
    if (latitude && longitude) {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
      );
    }
    else {
      this.mapUrl = null;
    }
  }

  addOpeningHour() {
    if (this.newOpeningDay.trim() && this.newOpeningHours.trim()) {
      this.branch.opening_hours.push({
        day: this.newOpeningDay.trim(),
        hours: this.newOpeningHours.trim()
      });
      this.newOpeningDay = '';
      this.newOpeningHours = '';
      this.openingHoursValidationError = '';
    } else {
      alert('Please enter both day(s) and hours');
    }
  }

  deleteOpeningHour(index: number) {
    this.branch.opening_hours.splice(index, 1);
  }

  cancelDelete() {
    this.confirmDeleteIndex = null;
  }

  back() {
    this.router.navigate(['/app-settings']);
  }

  validateAllRequiredFields(): boolean {
    let isValid = true;
    let errorMessages = [];
    if (!this.branch.name?.trim()) {
      errorMessages.push('Branch Name is required');
      isValid = false;
    }
    if (!this.branch.address_line1?.trim()) {
      errorMessages.push('Address Line 1 is required');
      isValid = false;
    }
    if (!this.branch.address_line2?.trim()) {
      errorMessages.push('Address Line 2 is required');
      isValid = false;
    }
    if (!this.branch.tel?.trim()) {
      errorMessages.push('Branch Telephone is required');
      isValid = false;
    } else if (this.branch.tel.replace(/\D/g, '').length < 10) {
      errorMessages.push('Branch Telephone must be at least 10 digits');
      isValid = false;
    }
    if (!this.branch.email?.trim()) {
      errorMessages.push('Branch Email is required');
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.branch.email)) {
        errorMessages.push('Please enter a valid email address');
        isValid = false;
      }
    }
    if (!this.branch.postalcode?.trim()) {
      errorMessages.push('Postal Code is required');
      isValid = false;
    }
    if (!this.branch.opening_hours || this.branch.opening_hours.length === 0) {
      errorMessages.push('At least one opening hour is required');
      this.openingHoursValidationError = 'At least one opening hour is required';
      isValid = false;
    } else {
      this.openingHoursValidationError = '';
    }
    if (!this.branch.latitude?.trim()) {
      errorMessages.push('Latitude is required');
      isValid = false;
    }
    if (!this.branch.longitude?.trim()) {
      errorMessages.push('Longitude is required');
      isValid = false;
    }
    if (!isValid) {
      alert('Please fill in the following required fields:\n' + errorMessages.join('\n'));
    }
    return isValid;
  }

  save() {
    if (!this.validateAllRequiredFields()) {
      return;
    }
    if (!this.gps.usersID) {
      alert('User ID is missing. Cannot continue.');
      return;
    }
    const isCreating = !this.isEditMode;
    const endpoint = isCreating ? globals.addBranchesEndpoint : globals.updateBranchesEndpoint;
    const payload: any = {
      ...this.branch,
      opening_hours: this.branch.opening_hours || [],
      address_line2: this.branch.address_line2 || '',
      address_line3: this.branch.address_line3 || '',
      address_line4: this.branch.address_line4 || '',
      fax: this.branch.fax || '',
      email: this.branch.email || '',
      postalcode: this.branch.postalcode || '',
      latitude: this.branch.latitude || '',
      longitude: this.branch.longitude || ''
    };
    if (isCreating) {
      payload.createdby = this.gps.usersID;
      payload.isactive = 1;
    } else {
      payload.branches_id = this.branch.branches_id;
    }
    this.api.post(endpoint, payload).subscribe({
      next: () => {
        alert(`Branch ${isCreating ? 'created' : 'updated'} successfully!`);
        this.router.navigate(['/app-settings'], { state: { tab: 'branches' } });
      },
      error: (err) => {
        console.error(`Error ${isCreating ? 'creating' : 'updating'} branch:`, err);
        alert(`Failed to ${isCreating ? 'create' : 'update'} branch. ${err?.error?.message || ''}`);
      }
    });
  }

  postcode_validate() {
    this.branch.postalcode = this.branch.postalcode.toUpperCase();
    let postcode = this.branch.postalcode.replace(/\s/g, '');
    if (postcode.length > 5 && postcode.length < 9) {
      this.branch.postalcode = this.validatePostcode(postcode);
    }
  }

  validatePostcode(postcode: string): string {
    postcode = postcode.replace(/\s/g, '');
    let lastIndex = postcode.length - 3;
    postcode = postcode.slice(0, lastIndex) + ' ' + postcode.slice(lastIndex)
    return postcode.toUpperCase();
  }

  validatePhoneNumber() {
    this.phoneValidationError = '';
    let phone = this.branch.tel.replace(/\D/g, '');
    this.branch.tel = phone;
    if (this.branch.tel.length > 0 && this.branch.tel.length < 10) {
      this.phoneValidationError = 'Phone number must be at least 10 digits long';
    } else if (this.branch.tel.length > 15) {
      this.phoneValidationError = 'Phone number is too long';
      this.branch.tel = this.branch.tel.slice(0, 15);
    }
    return this.branch.tel;
  }

  validateFaxNumber() {
    this.faxValidationError = '';
    let fax = this.branch.fax.replace(/\D/g, '');
    this.branch.fax = fax;
    if (this.branch.fax.length > 0 && this.branch.fax.length < 10) {
      this.faxValidationError = 'Fax number must be at least 10 digits long';
    } else if (this.branch.fax.length > 15) {
      this.faxValidationError = 'Fax number is too long';
      this.branch.fax = this.branch.fax.slice(0, 15);
    }
    return this.branch.fax;
  }

  validateEmail() {
    this.emailValidationError = '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.branch.email && this.branch.email.trim() && !emailPattern.test(this.branch.email)) {
      this.emailValidationError = 'Please enter a valid email address';
    }
    return this.branch.email;
  }
}