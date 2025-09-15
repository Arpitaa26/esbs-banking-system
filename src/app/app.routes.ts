import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CommonLayoutComponent } from './pages/common-layout/common-layout.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserProfileComponent } from './pages/customer-managemnet-tabs/user-profile/user-profile.component';
import { SavingsComponent } from './pages/customer-managemnet-tabs/savings/savings.component';
import { MarketingRefrencesComponent } from './pages/customer-managemnet-tabs/marketing-refrences/marketing-refrences.component';
import { CustomerManagementTabsComponent } from './pages/customer-managemnet-tabs/customer-management-tabs/customer-management-tabs.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductApplicationComponent } from './pages/product-application/product-application.component';
import { MarketingPushMessagingComponent } from './pages/marketing-push-messaging/marketing-push-messaging.component';
import { AppSettingsComponent } from './pages/app-settings/app-settings.component';
import { SuperAdminComponent } from './pages/super-admin/super-admin.component';
import { ApiLogsComponent } from './pages/api-logs/api-logs.component';
import { AddUpdateUserComponent } from './pages/users/add-update-user/add-update-user.component';
import { AddUpdateUserRoleComponent } from './pages/users/add-update-user-role/add-update-user-role.component';
import { ProductApplicationDetailsComponent } from './pages/product-application/product-application-details/product-application-details.component';
import { ExistingCustomerMigrationComponent } from './pages/existing-customer-migration/existing-customer-migration.component';
import { CampaignManagementComponent } from './pages/campaign-management/campaign-management.component';
import { AuditLogsComponent } from './pages/customer-managemnet-tabs/audit-logs/audit-logs.component';
import { ExistingCustomerOnboardingComponent } from './pages/existing-customer-onboarding/existing-customer-onboarding.component';
import { FaqSectionComponent } from './pages/faq-section/faq-section.component';
import { DeleteCustomerComponent } from './pages/delete-customer/delete-customer.component';
import { ExistingOnboardingCustomerDetailComponent } from './pages/existing-customer-onboarding/existing-onboarding-customer-detail/existing-onboarding-customer-detail.component';
import { AddUpdateMarketingPushMessageComponent } from './pages/marketing-push-messaging/add-update-marketing-push-message/add-update-marketing-push-message.component';
import { AddUpdateCampaignComponent } from './pages/campaign-management/add-update-campaign/add-update-campaign.component';
import { ProductComponent } from './pages/products/product/product.component';
import { AddUpdateBranchComponent } from './pages/app-settings/add-update-branch/add-update-branch.component';
import { AddUpdateImportantInformationComponent } from './pages/app-settings/add-update-important-information/add-update-important-information.component';
import { AddUpdateSmsComponent } from './pages/app-settings/add-update-sms/add-update-sms.component';
import { ApiLogDetailsComponent } from './pages/api-logs/api-log-details/api-log-details.component';
import { AddUpdateFaqsCategoryComponent } from './pages/faq-section/add-update-faqs-category/add-update-faqs-category.component';
import { AddUpdateFaqComponent } from './pages/faq-section/add-update-faq/add-update-faq.component';
import { ProductCodeComponent } from './pages/product-code/product-code.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { StopComponent } from './pages/stop/stop.component';
import { SavingsDetailsComponent } from './pages/customer-managemnet-tabs/savings/savings-details/savings-details.component';
import { TransferMessageMappingComponent } from './pages/transfer-message-mapping/transfer-message-mapping.component';
import { TwoFaAuthComponent } from './auth/two-fa-auth/two-fa-auth.component';
import { AuthOtpPageComponent } from './auth/auth-otp-page/auth-otp-page.component';
import { AddTransferMessageComponent } from './pages/transfer-message-mapping/add-transfer-message/add-transfer-message.component';
import { ScreenLabelComponent } from './pages/screen-label/screen-label.component';
import { AddUpdateSuperAdminComponent } from './pages/super-admin/add-update-super-admin/add-update-super-admin.component';
import { DetailsComponent } from './pages/customer-managemnet-tabs/audit-logs/details/details.component';
import { StaffUserManagementComponent } from './pages/Teller/staff-user-management/staff-user-management.component';
import { SystemRequestManagementComponent } from './pages/Teller/system-request-management/system-request-management.component';
import { HeadOfficeBranchViewComponent } from './pages/Teller/head-office-branch-view/head-office-branch-view.component';
import { BranchViewComponent } from './pages/Teller/branch-view/branch-view.component';
import { StaffDetailsComponent } from './pages/Teller/staff-details/staff-details.component';
import { TillSettingsComponent } from './pages/Teller/till-settings/till-settings.component';
import { CustomerMenuComponent } from './pages/Teller/customer-menu/customer-menu.component';
import { FormBuilderComponent } from './pages/Teller/form-builder/form-builder.component';
import { ExternalLinkMenuComponent } from './pages/Teller/external-link-menu/external-link-menu.component';
import { RoleManagementComponent } from './pages/Teller/role-management/role-management.component';
import { authGuard } from './guard/auth.guard';
import { ExternalLinkMenuAddEditComponent } from './pages/Teller/external-link-menu-add-edit/external-link-menu-add-edit.component';
import { ContactUsMessagesComponent } from './pages/contact-us-messages/contact-us-messages.component';
import { ContactUsMessagesDetailsComponent } from './pages/contact-us-messages/contact-us-messages-details/contact-us-messages-details.component';
import { ThirdPartyAuditLogsComponent } from './pages/Teller/third-party-audit-logs/third-party-audit-logs.component';
import { AuditLogsDetailsComponent } from './pages/Teller/audit-logs-details/audit-logs-details.component';
import { BranchAuditLogComponent } from './pages/Teller/branch-audit-log/branch-audit-log.component';
import { PrintConfigurationComponent } from './pages/Teller/print-configuration/print-configuration.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AddRoleComponent } from './pages/users/add-role/add-role.component';
import { ViewDenominationComponent } from './pages/Teller/view-denomination/view-denomination.component';
import { TellerApiLogsComponent } from './pages/Teller/teller-api-logs/teller-api-logs.component';
import { ExistingCustomerProductApplicationComponent } from './pages/existing-customer-product-application/existing-customer-product-application.component';
import { ScreenLabelDetailsComponent } from './pages/screen-label/screen-label-details/screen-label-details.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: '2fa-authentication', component: TwoFaAuthComponent },
  { path: 'passcode', component: AuthOtpPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: CommonLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'customer-management',
        component: CustomerManagementComponent,
        data: { title: 'Customer Management' },
        children: [
          {
            path: 'tabs',
            component: CustomerManagementTabsComponent,
            children: [
              {
                path: 'user-profile',
                component: UserProfileComponent,
                data: { title: 'Customer Management > User Profile' },
              },
              {
                path: 'savings',
                component: SavingsComponent,
                data: { title: 'Customer Management > Savings' },
                children: [
                  {
                    path: 'savings-details',
                    component: SavingsDetailsComponent,
                    data: { title: 'Customer Management > Savings-details' },
                  },
                ],
              },
              {
                path: 'audit-logs',
                component: AuditLogsComponent,
                data: { title: 'Customer Management > Audit Logs' },
                children: [
                  {
                    path: 'details',
                    component: DetailsComponent,
                  },
                ],
              },
              {
                path: 'marketing-refrences',
                component: MarketingRefrencesComponent,
                data: { title: 'Customer Management > Marketing Refrences' },
              },
              { path: '', redirectTo: 'user-profile', pathMatch: 'full' },
            ],
          },
        ],
      },

      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Staff User Management' },
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: { title: 'Product Management' },
      },
      {
        path: 'product-application',
        component: ProductApplicationComponent,
        data: { title: 'New Customer Onboarding' },
      },
      {
        path: 'marketing-push-messaging',
        component: MarketingPushMessagingComponent,
        data: { title: 'Marketing Push Messaging' },
        children: [],
      },
      {
        path: 'app-settings',
        component: AppSettingsComponent,
        data: { title: 'App Settings' },
        children: [],
      },
      {
        path: 'super-admin',
        component: SuperAdminComponent,
        data: { title: 'Super Admin' },
        children: [],
      },

      {
        path: 'transfer-message-mapping',
        component: TransferMessageMappingComponent,
        data: { title: 'Transfer Message Mapping' },
        children: [
          {
            path: 'add-transfer-message',
            component: AddTransferMessageComponent,
          },
        ],
      },

      {
        path: 'api-logs',
        component: ApiLogsComponent,
        data: { title: 'API Logs' },
        children: [],
      },
      {
        path: 'add-update-user',
        component: AddUpdateUserComponent,
        data: { title: 'Staff User Management > Add/Update User' },
        children: [],
      },
      {
        path: 'add-update-user-role',
        component: AddUpdateUserRoleComponent,
        data: { title: 'Staff User Management > Add/Update User Role' },
        children: [],
      },
      { path: 'app-add-role', component: AddRoleComponent, children: [] },
      {
        path: 'product-application-details',
        component: ProductApplicationDetailsComponent,
        data: { title: 'New Customer Onboarding > New Customer Onboarding Details' },
        children: [],
      },
      {
        path: 'existing-customer-product-application',
        component: ExistingCustomerProductApplicationComponent,
        data: { title: 'Existing Customer Product Application' },
        children: [],
      },
      {
        path: 'campaign-management',
        component: CampaignManagementComponent,
        data: { title: 'Campaign Management' },
        children: [],
      },
      {
        path: 'existing-customer-migration',
        component: ExistingCustomerMigrationComponent,
        data: { title: 'Existing Customer Migration' },
        children: [],
      },
      {
        path: 'existing-customer-onboarding',
        component: ExistingCustomerOnboardingComponent,
        data: { title: 'Existing Customer Onboarding' },
        children: [],
      },
      {
        path: 'faq-section',
        component: FaqSectionComponent,
        data: { title: 'FAQ' },
        children: [],
      },
      {
        path: 'delete-customer',
        component: DeleteCustomerComponent,
        data: { title: 'Delete Customer' },
        children: [],
      },
      {
        path: 'existing-onboarding-customer-detail',
        component: ExistingOnboardingCustomerDetailComponent,
        data: {
          title:
            'Existing Customer Onboarding > Existing Customer Onboarding Detail',
        },
        children: [],
      },
      {
        path: 'add-update-marketing-push-message',
        component: AddUpdateMarketingPushMessageComponent,
        data: {
          title:
            'Marketing Push Messaging > Add/Update Marketing Push Messaging',
        },
        children: [],
      },
      {
        path: 'add-update-campaign',
        component: AddUpdateCampaignComponent,
        data: { title: 'Campaign Management > Add/Update Campaign' },
        children: [],
      },
      {
        path: 'product',
        component: ProductComponent,
        data: { title: 'Product Management > Add/Update Product' },
        children: [],
      },
      {
        path: 'add-update-branch',
        component: AddUpdateBranchComponent,
        data: { title: 'App Settings > Add-Update Branch' },
        children: [],
      },
      {
        path: 'add-update-important-information',
        component: AddUpdateImportantInformationComponent,
        data: { title: 'App Settings > News, Blogs & Social' },
        children: [],
      },
      {
        path: 'add-update-sms',
        component: AddUpdateSmsComponent,
        data: { title: 'App Settings > Add/Update SMS' },
        children: [],
      },
      {
        path: 'api-logs-details',
        component: ApiLogDetailsComponent,
        data: { title: 'API Logs > API Details' },
        children: [],
      },
      {
        path: 'add-update-faq',
        component: AddUpdateFaqComponent,
        data: { title: 'FAQ > Add/Update FAQs' },
        children: [],
      },
      {
        path: 'add-update-faqs-category',
        component: AddUpdateFaqsCategoryComponent,
        data: { title: 'FAQ > Add/Update FAQ Category' },
        children: [],
      },
      {
        path: 'product-code',
        component: ProductCodeComponent,
        data: { title: 'Product Code' },
        children: [],
      },
      {
        path: 'account-list',
        component: AccountListComponent,
        data: { title: 'Account List' },
        children: [],
      },
      {
        path: 'stop',
        component: StopComponent,
        data: { title: 'Stop' },
        children: [],
      },
      {
        path: 'screen-lable',
        component: ScreenLabelComponent,
        data: { title: 'Screen Label' },
        children: [],
      },
      {
        path: 'add-update-super-admin',
        component: AddUpdateSuperAdminComponent,
        data: { title: 'Super Admin > Add/Update Super Admin' },
      },

      {
        path: 'staff-user-management',
        component: StaffUserManagementComponent,
        data: { title: 'Staff User Management' },
      },
      {
        path: 'staff-user-details',
        component: StaffDetailsComponent,
        data: { title: 'Staff User Details' },
      },
      {
        path: 'head-office-branch-view',
        component: HeadOfficeBranchViewComponent,
        data: { title: 'Head Office Teller View' },
      },
      {
        path: 'branch-view/:id',
        component: BranchViewComponent,
        data: { title: 'Branch View' },
      },
      {
        path: 'system-request-management',
        component: SystemRequestManagementComponent,
        data: { title: 'System Request' },
      },
      {
        path: 'till-settings',
        component: TillSettingsComponent,
        data: { title: 'Till Settings' },
      },
      {
        path: 'customer-menu',
        component: CustomerMenuComponent,
        data: { title: 'Customer Menu' },
      },
      {
        path: 'customer-menu-edit',
        component: FormBuilderComponent,
        data: { title: 'Customer Menu Add/Edit' },
      },
      {
        path: 'external-link-menu-add-edit',
        component: ExternalLinkMenuAddEditComponent,
        data: { title: 'External Link Menu Add/Edit' },
      },
      {
        path: 'external-link-menu',
        component: ExternalLinkMenuComponent,
        data: { title: 'External Link Menu' },
      },
      {
        path: 'role-management',
        component: RoleManagementComponent,
        data: { title: 'Role Management' },
      },
      {
        path: 'third-party-audit-logs',
        component: ThirdPartyAuditLogsComponent,
        data: { title: 'Third Party API Logs' },
      },
      {
        path: 'audit-logs-details/:id',
        component: AuditLogsDetailsComponent,
        data: { title: 'API Logs > API Details' },
      },
      {
        path: 'branch-audit-logs/:branchId',
        component: BranchAuditLogComponent,
        data: { title: 'Branch Audit Logs' },
      },
      {
        path: 'print-configuration',
        component: PrintConfigurationComponent,
        data: { title: 'Print Configuration' },
      },
      {
        path: 'contact-us-messages',
        component: ContactUsMessagesComponent,
        data: { title: 'Contact Us' },
      },
      {
        path: 'contact-us-messages-details',
        component: ContactUsMessagesDetailsComponent,
        data: { title: 'Contact Us Messages' },
      },
      {
        path: 'view-denomination',
        component: ViewDenominationComponent,
        data: { title: 'View Denomination' },
      },
      {
        path: 'teller-api-logs',
        component: TellerApiLogsComponent,
        data: { title: 'Teller API Logs' },
      },
        {
        path: 'screen-label-details',
        component: ScreenLabelDetailsComponent,
        data: { title: 'Screen Label Details' },
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
