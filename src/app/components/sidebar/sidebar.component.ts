import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ApiGateWayService } from '../../services/apiGateway.service';
import { GlobalProviderService } from 'app/services/global-provider.service';
interface MenuItem {
  label: string;
  route?: string;
  name?: string;
  icon: SafeHtml;
  isLogout?: boolean;
}
interface MenuSection {
  title: string;
  route?: string;
  isOpen: boolean;
  icon: SafeHtml;
  items: MenuItem[];
}
@Component({
  selector: 'sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuSections: MenuSection[];
  activeSectionTitle: string | null = null;
  permissions: any = {};
  standaloneItems: (
    | {
      label: string;
      name: string;
      route: string;
      icon: SafeHtml;
      isLogout?: undefined;
    }
    | {
      label: string;
      isLogout: boolean;
      icon: SafeHtml;
      name?: undefined;
      route?: undefined;
    }
  )[];

  constructor(
    private sanitizer: DomSanitizer,
    private apiGatewayService: ApiGateWayService,
    private router: Router,
    private gps: GlobalProviderService
  ) {
    this.standaloneItems = [
      {
        label: 'Staff User Management',
        name: 'staffusers',
        route: '/users',
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6.75 10C8.54493 10 10 8.54493 10 6.75C10 4.95507 8.54493 3.5 6.75 3.5C4.95507 3.5 3.5 4.95507 3.5 6.75C3.5 8.54493 4.95507 10 6.75 10ZM12.4373 15.1449C12.9668 15.3619 13.6409 15.5 14.4992 15.5C18.4992 15.5 18.4992 12.5 18.4992 12.5C18.4992 11.6716 17.8276 11 16.9992 11H12.3714C12.7641 11.4755 13 12.0852 13 12.75V13.0625C13 13.0625 13 13.0619 13 13.0646L13 13.0667L13 13.0713L12.9999 13.0814L12.9995 13.1058C12.9991 13.1238 12.9984 13.1453 12.9973 13.1701C12.995 13.2197 12.9908 13.2828 12.9835 13.3575C12.9688 13.5065 12.9408 13.7047 12.8875 13.9363C12.8096 14.2745 12.6743 14.6976 12.4373 15.1449ZM17 7.5C17 8.88071 15.8807 10 14.5 10C13.1193 10 12 8.88071 12 7.5C12 6.11929 13.1193 5 14.5 5C15.8807 5 17 6.11929 17 7.5ZM1.5 13C1.5 11.8954 2.39543 11 3.5 11H10C11.1046 11 12 11.8954 12 13C12 13 12 17 6.75 17C1.5 17 1.5 13 1.5 13ZM12.9995 13.1058L12.9973 13.1701L12.9995 13.1058Z" fill="#A6A6A6"/>
            </svg>`),
      },
      {
        label: 'Logout',
        isLogout: true,
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.9 7.55999C9.21 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12H14.88" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.65 8.65002L16 12L12.65 15.35" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
      },
    ];
    this.menuSections = [
      {
        title: 'Teller',
        route: '',
        isOpen: false,
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="5" r="1.5" fill="currentColor"/>
          <rect x="8" y="4" width="12" height="2" fill="currentColor"/>
          <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
          <rect x="8" y="11" width="12" height="2" fill="currentColor"/>
          <circle cx="4" cy="19" r="1.5" fill="currentColor"/>
          <rect x="8" y="18" width="12" height="2" fill="currentColor"/>
        </svg>
        `),
        items: [
          {
            label: 'Till Settings',
            route: '/till-settings',
            name: 'tillsettings',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
              <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.83333 11.8066V10.1933C1.83333 9.23998 2.6125 8.45165 3.575 8.45165C5.23417 8.45165 5.9125 7.27832 5.07833 5.83915C4.60167 5.01415 4.88583 3.94165 5.72 3.46498L7.30583 2.55748C8.03 2.12665 8.965 2.38332 9.39583 3.10748L9.49667 3.28165C10.3217 4.72082 11.6783 4.72082 12.5125 3.28165L12.6133 3.10748C13.0442 2.38332 13.9792 2.12665 14.7033 2.55748L16.2892 3.46498C17.1233 3.94165 17.4075 5.01415 16.9308 5.83915C16.0967 7.27832 16.775 8.45165 18.4342 8.45165C19.3875 8.45165 20.1758 9.23082 20.1758 10.1933V11.8066C20.1758 12.76 19.3967 13.5483 18.4342 13.5483C16.775 13.5483 16.0967 14.7216 16.9308 16.1608C17.4075 16.995 17.1233 18.0583 16.2892 18.535L14.7033 19.4425C13.9792 19.8733 13.0442 19.6166 12.6133 18.8925L12.5125 18.7183C11.6875 17.2791 10.3308 17.2791 9.49667 18.7183L9.39583 18.8925C8.965 19.6166 8.03 19.8733 7.30583 19.4425L5.72 18.535C4.88583 18.0583 4.60167 16.9858 5.07833 16.1608C5.9125 14.7216 5.23417 13.5483 3.575 13.5483C2.6125 13.5483 1.83333 12.76 1.83333 11.8066Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Head Office Teller View',
            route: '/head-office-branch-view',
            name: 'headofficetellerview',
            icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 21h18"/> <path d="M5 21V7l8-4v18"/> <path d="M19 21V11l-6-4"/> <path d="M9 9v.01"/> <path d="M9 12v.01"/>
              <path d="M9 15v.01"/> <path d="M9 18v.01"/>
            </svg>
            `),
          },
          {
            label: 'Customer Menu',
            route: '/customer-menu',
            name: 'customermenu',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 10.5C12.9162 10.5 14.875 8.54125 14.875 6.125C14.875 3.70875 12.9162 1.75 10.5 1.75C8.08375 1.75 6.125 3.70875 6.125 6.125C6.125 8.54125 8.08375 10.5 10.5 10.5Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.98373 19.25C2.98373 15.8638 6.3525 13.125 10.5 13.125" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.925 18.725C17.4714 18.725 18.725 17.4714 18.725 15.925C18.725 14.3786 17.4714 13.125 15.925 13.125C14.3786 13.125 13.125 14.3786 13.125 15.925C13.125 17.4714 14.3786 18.725 15.925 18.725Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.25 19.25L18.375 18.375" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'External Link Menu',
            route: '/external-link-menu',
            name: 'externallinkmenu',
            icon: this.sanitizer.bypassSecurityTrustHtml(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A6A6A6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13M14 11a5 5 0 0 1 0 7l-1.5 1.5a5 5 0 0 1-7-7L7 11"/>
              </svg>
            `),
          },
          {
            label: 'System Request',
            route: '/system-request-management',
            name: 'systemrequest',
            icon: this.sanitizer.bypassSecurityTrustHtml(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A6A6A6">
              <rect x="3" y="4" width="18" height="12" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20h8m-4-4v4"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6m0 0l-2-2m2 2l-2 2"/>
            </svg>
            `),
          },
          {
            label: 'Third Party Api Logs',
            route: '/third-party-audit-logs',
            name: 'thirdpartyapilogs',
            icon: this.sanitizer.bypassSecurityTrustHtml(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A6A6A6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2z" />
              </svg>
            `),
          },
          {
            label: 'Print Configuration',
            route: '/print-configuration',
            name: 'printconfiguration',
            icon: this.sanitizer.bypassSecurityTrustHtml(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A6A6A6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 9V4h12v5M6 18h12v2H6v-2zm12-7H6a2 2 0 00-2 2v5h16v-5a2 2 0 00-2-2zM8 14h8"/>
              </svg>
            `),
          },
          {
            label: 'API Logs',
            name: 'apilogs',
            route: '/teller-api-logs',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15.24 2H8.76C5 2 4.71 5.38 6.74 7.22L17.26 16.78C19.29 18.62 19 22 15.24 22H8.76C5 22 4.71 18.62 6.74 16.78L17.26 7.22C19.29 5.38 19 2 15.24 2Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
        ],
      },
      {
        title: 'App/ Online',
        route: '',
        isOpen: false,
        icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="5" r="1.5" fill="currentColor"/>
          <rect x="8" y="4" width="12" height="2" fill="currentColor"/>
          <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
          <rect x="8" y="11" width="12" height="2" fill="currentColor"/>
          <circle cx="4" cy="19" r="1.5" fill="currentColor"/>
          <rect x="8" y="18" width="12" height="2" fill="currentColor"/>
        </svg>
        `),
        items: [
          {
            label: 'Dashboard',
            name: 'dashboard',
            route: '/dashboard',
            icon: this.sanitizer.bypassSecurityTrustHtml(
              `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 0H3C1.34315 0 0 1.34315 0 3V11C0 12.6569 1.34315 14 3 14H4V0ZM5 14H11C12.6569 14 14 12.6569 14 11V10H5V14ZM14 9V3C14 1.34315 12.6569 0 11 0H5V9H14Z" fill="#A6A6A6"/></svg>`
            ),
          },
          {
            label: 'Delete Customers',
            name: 'deletecustomer',
            route: '/delete-customer',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M16.1088 15.8287L13.6413 18.2962" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.1088 18.2962L13.6413 15.8287" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.64 9.51125C10.5525 9.5025 10.4475 9.5025 10.3512 9.51125C8.26875 9.44125 6.615 7.735 6.615 5.635C6.615 3.49125 8.3475 1.75 10.5 1.75C12.6437 1.75 14.385 3.49125 14.385 5.635C14.3763 7.735 12.7225 9.44125 10.64 9.51125Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.5 19.0838C8.9075 19.0838 7.32375 18.6813 6.11625 17.8763C3.99875 16.4588 3.99875 14.1488 6.11625 12.74C8.5225 11.13 12.4688 11.13 14.875 12.74" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Customer Management',
            name: 'customers',
            route: '/customer-management',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M18.445 7.50753V13.4925C18.445 14.4725 17.92 15.3825 17.0712 15.8813L11.8737 18.8825C11.025 19.3725 9.975 19.3725 9.1175 18.8825L3.92 15.8813C3.07125 15.3913 2.54625 14.4813 2.54625 13.4925V7.50753C2.54625 6.52753 3.07125 5.61749 3.92 5.11874L9.1175 2.1175C9.96625 1.6275 11.0162 1.6275 11.8737 2.1175L17.0712 5.11874C17.92 5.61749 18.445 6.51878 18.445 7.50753Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.5 9.62499C11.626 9.62499 12.5387 8.7122 12.5387 7.58623C12.5387 6.46026 11.626 5.54752 10.5 5.54752C9.37403 5.54752 8.46125 6.46026 8.46125 7.58623C8.46125 8.7122 9.37403 9.62499 10.5 9.62499Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 14.5775C14 13.0025 12.4338 11.725 10.5 11.725C8.56625 11.725 7 13.0025 7 14.5775" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Existing Customer Onboarding',
            name: 'existingonboardingcustomers',
            route: '/existing-customer-onboarding',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 10.5C12.9162 10.5 14.875 8.54125 14.875 6.125C14.875 3.70875 12.9162 1.75 10.5 1.75C8.08375 1.75 6.125 3.70875 6.125 6.125C6.125 8.54125 8.08375 10.5 10.5 10.5Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.98373 19.25C2.98373 15.8638 6.3525 13.125 10.5 13.125" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.925 18.725C17.4714 18.725 18.725 17.4714 18.725 15.925C18.725 14.3786 17.4714 13.125 15.925 13.125C14.3786 13.125 13.125 14.3786 13.125 15.925C13.125 17.4714 14.3786 18.725 15.925 18.725Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.25 19.25L18.375 18.375" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'New Customer Onboarding',
            name: 'productsapplication',
            route: '/product-application',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M15.125 15.2442V12.2558" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.33333 14.6667H4.9775C2.87833 14.6667 1.83333 13.6217 1.83333 11.5225V4.97751C1.83333 2.87834 2.87833 1.83334 4.9775 1.83334H9.16667C11.2658 1.83334 12.3108 2.87834 12.3108 4.97751" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.0225 20.1667H12.8333C10.7342 20.1667 9.68917 19.1217 9.68917 17.0225V10.4775C9.68917 8.37834 10.7342 7.33334 12.8333 7.33334H17.0225C19.1217 7.33334 20.1667 8.37834 20.1667 10.4775V17.0225C20.1667 19.1217 19.1217 20.1667 17.0225 20.1667Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.6308 13.75H16.6192" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Existing Customer Product Application',
            name: 'productsapplication',
            route: '/existing-customer-product-application',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
             <path d="M12.6667 14.4897H12.0755C11.4533 14.4897 10.8622 14.7377 10.4267 15.1858L9.09665 16.5379C8.48998 17.154 7.50224 17.154 6.89557 16.5379L5.56555 15.1858C5.13 14.7377 4.53111 14.4897 3.91667 14.4897H3.33333C2.04222 14.4897 1 13.4256 1 12.1134V3.3763C1 2.06413 2.04222 1 3.33333 1H12.6667C13.9578 1 15 2.06413 15 3.3763V12.1054C15 13.4176 13.9578 14.4897 12.6667 14.4897Z" stroke="#A6A6A6" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M7.85511 6.5607C7.82311 6.5607 7.77508 6.5607 7.73508 6.5607C6.89497 6.52869 6.23089 5.84861 6.23089 5.0005C6.23089 4.13639 6.92698 3.44031 7.79109 3.44031C8.6552 3.44031 9.3513 4.1444 9.3513 5.0005C9.3593 5.84861 8.69522 6.53669 7.85511 6.5607Z" stroke="#A6A6A6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M5.59883 8.96897C4.53469 9.68106 4.53469 10.8412 5.59883 11.5533C6.80698 12.3614 8.79123 12.3614 9.99938 11.5533C11.0635 10.8412 11.0635 9.68106 9.99938 8.96897C8.79123 8.16887 6.81498 8.16887 5.59883 8.96897Z" stroke="#A6A6A6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`),
          },
          {
            label: 'Product Management',
            name: 'products',
            route: '/products',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9.7575 2.18999L14.1825 4.15499C15.4575 4.71749 15.4575 5.64749 14.1825 6.20999L9.7575 8.17499C9.255 8.39999 8.43 8.39999 7.9275 8.17499L3.5025 6.20999C2.2275 5.64749 2.2275 4.71749 3.5025 4.15499L7.9275 2.18999C8.43 1.96499 9.255 1.96499 9.7575 2.18999Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.25 8.25C2.25 8.88 2.7225 9.6075 3.3 9.8625L8.3925 12.1275C8.7825 12.3 9.225 12.3 9.6075 12.1275L14.7 9.8625C15.2775 9.6075 15.75 8.88 15.75 8.25" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.25 12C2.25 12.6975 2.6625 13.3275 3.3 13.6125L8.3925 15.8775C8.7825 16.05 9.225 16.05 9.6075 15.8775L14.7 13.6125C15.3375 13.3275 15.75 12.6975 15.75 12" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Marketing Push Messaging',
            name: 'pushmessages',
            route: '/marketing-push-messaging',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M20.1667 6.81081V12.3108C20.1667 13.6858 19.7083 14.8316 18.9017 15.6383C18.1042 16.4358 16.9583 16.8941 15.5833 16.8941V18.8466C15.5833 19.58 14.7675 20.02 14.1625 19.6167L10.0833 16.8941H8.14001C8.21334 16.6191 8.25 16.335 8.25 16.0417C8.25 15.1067 7.8925 14.245 7.30584 13.5942C6.64584 12.8425 5.665 12.375 4.58333 12.375C3.55667 12.375 2.62167 12.7967 1.95251 13.4842C1.87001 13.1175 1.83333 12.7233 1.83333 12.3108V6.81081C1.83333 4.06081 3.66667 2.22748 6.41667 2.22748H15.5833C18.3333 2.22748 20.1667 4.06081 20.1667 6.81081Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.25 16.0417C8.25 16.7292 8.05751 17.38 7.71835 17.93C7.52585 18.26 7.27834 18.5533 6.99417 18.7917C6.3525 19.3692 5.50917 19.7083 4.58333 19.7083C3.245 19.7083 2.08082 18.9933 1.44832 17.93C1.10915 17.38 0.916666 16.7292 0.916666 16.0417C0.916666 14.8867 1.44833 13.8508 2.29167 13.1817C2.92417 12.6775 3.72167 12.375 4.58333 12.375C6.60917 12.375 8.25 14.0158 8.25 16.0417Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.15334 16.0417L4.06083 16.9492L6.01333 15.1434" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.79167 9.625H14.2083" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Campaign Management',
            name: 'campaign',
            route: '/campaign-management',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M1.83333 9.16668V12.8333C1.83333 14.6667 2.75 15.5833 4.58333 15.5833H5.89417C6.23333 15.5833 6.5725 15.6842 6.86583 15.8583L9.5425 17.5358C11.8525 18.9842 13.75 17.93 13.75 15.2075V6.79251C13.75 4.06084 11.8525 3.01584 9.5425 4.46418L6.86583 6.14168C6.5725 6.31584 6.23333 6.41668 5.89417 6.41668H4.58333C2.75 6.41668 1.83333 7.33334 1.83333 9.16668Z" stroke="#A6A6A6" stroke-width="1.5"/>
              <path d="M16.5 7.33334C18.1317 9.50584 18.1317 12.4942 16.5 14.6667" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.1775 5.04166C20.8267 8.57082 20.8267 13.4292 18.1775 16.9583" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },

          //       {
          //         label: 'Product Code',
          //         route: '/product-code',
          //         icon: this.sanitizer
          //           .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          //   <path d="M20 7.04V16.96C20 18.48 19.86 19.56 19.5 20.33C19.5 20.34 19.49 20.36 19.48 20.37C19.26 20.65 18.97 20.79 18.63 20.79C18.1 20.79 17.46 20.44 16.77 19.7C15.95 18.82 14.69 18.89 13.97 19.85L12.96 21.19C12.56 21.73 12.03 22 11.5 22C10.97 22 10.44 21.73 10.04 21.19L9.02002 19.84C8.31002 18.89 7.05999 18.82 6.23999 19.69L6.22998 19.7C5.09998 20.91 4.10002 21.09 3.52002 20.37C3.51002 20.36 3.5 20.34 3.5 20.33C3.14 19.56 3 18.48 3 16.96V7.04C3 5.52 3.14 4.44 3.5 3.67C3.5 3.66 3.50002 3.65 3.52002 3.64C4.09002 2.91 5.09998 3.09 6.22998 4.3L6.23999 4.31C7.05999 5.18 8.31002 5.11 9.02002 4.16L10.04 2.81C10.44 2.27 10.97 2 11.5 2C12.03 2 12.56 2.27 12.96 2.81L13.97 4.15C14.69 5.11 15.95 5.18 16.77 4.3C17.46 3.56 18.1 3.21 18.63 3.21C18.97 3.21 19.26 3.36 19.48 3.64C19.5 3.65 19.5 3.66 19.5 3.67C19.86 4.44 20 5.52 20 7.04Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M8 10.25H16" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M8 13.75H14" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          // </svg>`),
          //       },
          //       {
          //         label: 'Account List',
          //         route: '/account-list',
          //         icon: this.sanitizer
          //           .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          //   <path d="M17 14.4C17.6 14.4 18.1 14.9 18.1 15.5C18.1 16.1 17.6 16.6 17 16.6C16.4 16.6 15.9 16.1 15.9 15.5C15.9 14.9 16.4 14.4 17 14.4ZM17 17.5C16.3 17.5 14.8 17.9 14.8 18.6C15.3 19.3 16.1 19.8 17 19.8C17.9 19.8 18.7 19.3 19.2 18.6C19.2 17.9 17.7 17.5 17 17.5ZM18 11.1V6.3L10.5 3L3 6.3V11.2C3 15.7 6.2 20 10.5 21C11.1 20.9 11.6 20.7 12.1 20.5C13.2 22 15 23 17 23C20.3 23 23 20.3 23 17C23 14 20.8 11.6 18 11.1ZM11 17C11 17.6 11.1 18.1 11.2 18.6C11 18.7 10.7 18.8 10.5 18.9C7.3 17.9 5 14.7 5 11.2V7.6L10.5 5.2L16 7.6V11.1C13.2 11.6 11 14 11 17ZM17 21C14.8 21 13 19.2 13 17C13 14.8 14.8 13 17 13C19.2 13 21 14.8 21 17C21 19.2 19.2 21 17 21Z" fill="#A6A6A6"/>
          // </svg>`),
          //       },
          //       {
          //         label: 'Bank Sort Code',
          //         route: '/bank-sort-code',
          //         icon: this.sanitizer
          //           .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          //   <path d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M15 2V22" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M11.0945 12H11.1035" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M7.09448 12H7.10346" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          // </svg>`),
          //       },
          //       {
          //         label: 'Transfer Message Mapping',
          //         route: '/transfer-message-mapping',
          //         icon: this.sanitizer
          //           .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
          //   <path d="M13.4583 14.5905H10.2917L6.76874 16.9338C6.24624 17.2821 5.54167 16.9101 5.54167 16.2767V14.5905C3.16667 14.5905 1.58333 13.0071 1.58333 10.6321V5.8821C1.58333 3.5071 3.16667 1.92377 5.54167 1.92377H13.4583C15.8333 1.92377 17.4167 3.5071 17.4167 5.8821V10.6321C17.4167 13.0071 15.8333 14.5905 13.4583 14.5905Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M9.5 8.99335V8.82713C9.5 8.28879 9.83252 8.00378 10.165 7.7742C10.4896 7.55253 10.8141 7.26754 10.8141 6.74504C10.8141 6.01671 10.2283 5.43085 9.5 5.43085C8.77167 5.43085 8.18585 6.01671 8.18585 6.74504" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          //   <path d="M9.49644 10.8854H9.50356" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          // </svg>`),
          //       },
          {
            label: 'Contact Us Messages',
            name: 'contactmessages',
            route: '/contact-us-messages',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
              <path d="M11.8505 0.340438C11.7768 0.235099 11.6792 0.149229 11.5661 0.0900033C11.4529 0.0307777 11.3274 -8.31028e-05 11.2001 1.68068e-07H0.800082C0.653173 0.000134939 0.509137 0.0413517 0.383768 0.119131C0.258399 0.19691 0.156538 0.308247 0.0893547 0.440936C0.0221716 0.573624 -0.00773947 0.722538 0.00290135 0.87135C0.0135422 1.02016 0.064324 1.16313 0.149678 1.28456L3.8169 6.5L0.148878 11.7154C0.0634847 11.8369 0.0126961 11.98 0.0020871 12.1289C-0.00852195 12.2777 0.0214586 12.4267 0.0887381 12.5594C0.156018 12.6921 0.257995 12.8035 0.38348 12.8812C0.508964 12.9589 0.653105 13 0.800082 13H11.2001C11.3274 13.0001 11.4529 12.9692 11.5661 12.91C11.6792 12.8508 11.7768 12.7649 11.8505 12.6596L15.8506 6.97206C15.9477 6.83444 16 6.66935 16 6.5C16 6.33065 15.9477 6.16556 15.8506 6.02794L11.8505 0.340438V0.340438ZM10.7881 11.375H2.35449L5.45051 6.97206C5.54768 6.83444 5.59994 6.66935 5.59994 6.5C5.59994 6.33065 5.54768 6.16556 5.45051 6.02794L2.35449 1.625H10.7881L14.217 6.5L10.7881 11.375V11.375Z" fill="#A6A6A6"/>
            </svg>`),
          },
          {
            label: 'Screen Label',
            name: 'labels',
            route: '/screen-lable',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
              <path d="M11.8505 0.340438C11.7768 0.235099 11.6792 0.149229 11.5661 0.0900033C11.4529 0.0307777 11.3274 -8.31028e-05 11.2001 1.68068e-07H0.800082C0.653173 0.000134939 0.509137 0.0413517 0.383768 0.119131C0.258399 0.19691 0.156538 0.308247 0.0893547 0.440936C0.0221716 0.573624 -0.00773947 0.722538 0.00290135 0.87135C0.0135422 1.02016 0.064324 1.16313 0.149678 1.28456L3.8169 6.5L0.148878 11.7154C0.0634847 11.8369 0.0126961 11.98 0.0020871 12.1289C-0.00852195 12.2777 0.0214586 12.4267 0.0887381 12.5594C0.156018 12.6921 0.257995 12.8035 0.38348 12.8812C0.508964 12.9589 0.653105 13 0.800082 13H11.2001C11.3274 13.0001 11.4529 12.9692 11.5661 12.91C11.6792 12.8508 11.7768 12.7649 11.8505 12.6596L15.8506 6.97206C15.9477 6.83444 16 6.66935 16 6.5C16 6.33065 15.9477 6.16556 15.8506 6.02794L11.8505 0.340438V0.340438ZM10.7881 11.375H2.35449L5.45051 6.97206C5.54768 6.83444 5.59994 6.66935 5.59994 6.5C5.59994 6.33065 5.54768 6.16556 5.45051 6.02794L2.35449 1.625H10.7881L14.217 6.5L10.7881 11.375V11.375Z" fill="#A6A6A6"/>
            </svg>`),
          },
          {
            label: 'Stop',
            name: 'stop',
            route: '/stop',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M10.9725 20.1666C16.0351 20.1666 20.1392 16.0626 20.1392 11C20.1392 5.93737 16.0351 1.83331 10.9725 1.83331C5.90989 1.83331 1.80583 5.93737 1.80583 11C1.80583 16.0626 5.90989 20.1666 10.9725 20.1666Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.82667 13.3192V8.68082C9.82667 8.24082 9.64333 8.06665 9.17583 8.06665H7.98417C7.51667 8.06665 7.33333 8.24082 7.33333 8.68082V13.3192C7.33333 13.7592 7.51667 13.9333 7.98417 13.9333H9.16667C9.64333 13.9333 9.82667 13.7592 9.82667 13.3192Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.6667 13.3192V8.68082C14.6667 8.24082 14.4833 8.06665 14.0158 8.06665H12.8333C12.3658 8.06665 12.1825 8.24082 12.1825 8.68082V13.3192C12.1825 13.7592 12.3658 13.9333 12.8333 13.9333H14.0158C14.4833 13.9333 14.6667 13.7592 14.6667 13.3192Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'FAQ Categories',
            name: 'faqcategories',
            route: '/faq-section',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M14.875 16.1263H11.375L7.48124 18.7163C6.90374 19.1013 6.125 18.6901 6.125 17.9901V16.1263C3.5 16.1263 1.75 14.3763 1.75 11.7513V6.50125C1.75 3.87625 3.5 2.12625 6.125 2.12625H14.875C17.5 2.12625 19.25 3.87625 19.25 6.50125V11.7513C19.25 14.3763 17.5 16.1263 14.875 16.1263Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.5 9.94V9.75629C10.5 9.16129 10.8675 8.84627 11.235 8.59252C11.5938 8.34752 11.9525 8.03253 11.9525 7.45503C11.9525 6.65003 11.305 6.0025 10.5 6.0025C9.695 6.0025 9.04752 6.65003 9.04752 7.45503" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.4961 12.0312H10.5039" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'API Logs',
            name: 'apilogs',
            route: '/api-logs',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.24 2H8.76C5 2 4.71 5.38 6.74 7.22L17.26 16.78C19.29 18.62 19 22 15.24 22H8.76C5 22 4.71 18.62 6.74 16.78L17.26 7.22C19.29 5.38 19 2 15.24 2Z" stroke="#A6A6A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'App Settings',
            name: 'appsettings',
            route: '/app-settings',
            icon: this.sanitizer
              .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.83333 11.8066V10.1933C1.83333 9.23998 2.6125 8.45165 3.575 8.45165C5.23417 8.45165 5.9125 7.27832 5.07833 5.83915C4.60167 5.01415 4.88583 3.94165 5.72 3.46498L7.30583 2.55748C8.03 2.12665 8.965 2.38332 9.39583 3.10748L9.49667 3.28165C10.3217 4.72082 11.6783 4.72082 12.5125 3.28165L12.6133 3.10748C13.0442 2.38332 13.9792 2.12665 14.7033 2.55748L16.2892 3.46498C17.1233 3.94165 17.4075 5.01415 16.9308 5.83915C16.0967 7.27832 16.775 8.45165 18.4342 8.45165C19.3875 8.45165 20.1758 9.23082 20.1758 10.1933V11.8066C20.1758 12.76 19.3967 13.5483 18.4342 13.5483C16.775 13.5483 16.0967 14.7216 16.9308 16.1608C17.4075 16.995 17.1233 18.0583 16.2892 18.535L14.7033 19.4425C13.9792 19.8733 13.0442 19.6166 12.6133 18.8925L12.5125 18.7183C11.6875 17.2791 10.3308 17.2791 9.49667 18.7183L9.39583 18.8925C8.965 19.6166 8.03 19.8733 7.30583 19.4425L5.72 18.535C4.88583 18.0583 4.60167 16.9858 5.07833 16.1608C5.9125 14.7216 5.23417 13.5483 3.575 13.5483C2.6125 13.5483 1.83333 12.76 1.83333 11.8066Z" stroke="#A6A6A6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`),
          },
          {
            label: 'Super Admin',
            name: 'admin',
            route: '/super-admin',
            icon: this.sanitizer.bypassSecurityTrustHtml(
              `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 0H3C1.34315 0 0 1.34315 0 3V11C0 12.6569 1.34315 14 3 14H4V0ZM5 14H11C12.6569 14 14 12.6569 14 11V10H5V14ZM14 9V3C14 1.34315 12.6569 0 11 0H5V9H14Z" fill="#A6A6A6"/></svg>`
            ),
          },
        ],
      },
    ];

    this.permissions = this.gps.userPermissions;
  }

  toggleSection(section: MenuSection): void {
    section.isOpen = !section.isOpen;
    if (section.isOpen) {
      this.activeSectionTitle = section.title;
    } else if (this.activeSectionTitle === section.title) {
      this.activeSectionTitle = null;
    }
  }

  handleStandaloneItemClick(item: MenuItem): void {
    if (item.isLogout) {
      this.apiGatewayService.logout();
      return;
    }
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  activateSection(section: MenuSection, item?: any): void {
    if (item.label === 'Logout') {
      this.apiGatewayService.logout();
      return;
    }
    this.activeSectionTitle = section.title;
    section.isOpen = true;
  }
}
