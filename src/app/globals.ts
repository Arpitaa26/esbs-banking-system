import { environment } from "../environments/environment";

const baseUrl = environment.apiurl || '';
export const apiUrl = baseUrl;

/** Authentication APIs
 *
 * codeEndpoint - POST: Get authorization code
 * tokenEndpoint - POST: Verify token
 * refreshTokenEndpoint - POST: Refresh token
 * loginApiEndPoint - POST: Login user
 * forgotpassword - POST: Forget Password user
 * resetpassword - POST: Reset Password user
 */
export const codeEndpoint = `${apiUrl}/auth/authorization_code`;
export const tokenEndpoint = `${apiUrl}/auth/verify`;
export const refreshTokenEndpoint = `${apiUrl}/auth/refresh`;
export const loginApiEndPoint = `auth/login`;
export const forgotpassword = `auth/reset-password`;
export const resetpassword = `auth/change-password`;

/** Audit Logs
 *
 * getThirdPartyAuditLogs - GET: Fetch third-party API audit logs
 * getBranchLevelAuditLogs - GET: Fetch branch-level activity logs
 * getActivitiesStatusList - GET: Fetch list of activity statuses
 * getActivitiesList - GET: Fetch all activity logs
 * getApiAuditLogs - POST: Fetch all Hub Api logs and Perform Filters
 * getApiAuditLogsById - GET: Fetch API audit logs by ID
 */
export const getThirdPartyAuditLogs = `hub/third-party-api`;
export const getBranchLevelAuditLogs = `hub/activities/logs`;
export const getActivitiesStatusList = `hub/teller/activity/status`;
export const getActivitiesList = `hub/teller/activity`;
export const getApiAuditLogs = `hub/teller/audit-trails`;
export const getApiAuditLogsById = (id: number): string => `hub/teller/audit-trails/${id}`;

/** Branch Management APIs
 *
 * createBranchEndPoint - POST: Create a new branch
 * getBranchListApiEndPoint - GET: Fetch list of all branches
 * getBranchConfig - GET: Fetch configuration for a branch
 * postBranchConfig - POST: Update branch configuration
 * updateBranch - PUT: Update branch details
 * addDenominationToSafe - POST: Add Branch Denomination
 * getSafeFloat - GET: Get Safe Float
 * getTillFloat - GET: Get Till Float
 * getMasterFloat - GET: Get Master Float
 */
export const createBranchEndPoint = `hub/branch/create`;
export const getBranchListApiEndPoint = `hub/branch/getAllBranches`;
export const getBranchConfig = `hub/teller/config`;
export const postBranchConfig = `hub/teller/updateBranchConfig`;
export const updateBranch = `hub/branch/update`;
export const addDenominationToSafe = `hub/teller/add-denomination-to-safe-by-hub`;
export const getSafeFloat = (safe_id: number): string => `hub/teller/safe/${safe_id}/denomination`;
export const getTillFloat = (till_id: number): string => `hub/teller/till/${till_id}/denomination`;
export const getMasterFloat = `hub/teller/float-master`;

/** Country List APIs
 *
 * getcountrylist - GET: Fetch the list of countries
 */
export const getcountrylist = `teller/dropdown/getcountrylist`;

/** Customer Menu Teller
 *
 * createFormField - POST: Create a new form field
 * deleteFormField(id) - POST: Delete a form field by ID
 * updateFormField(id) - POST: Update a form field by ID
 * getFormField - GET: Fetch all form fields
 * creatCustomerMenu - POST: Create a new customer menu
 * getCustomerMenu - GET: Fetch all customer menus
 * getCustomerMenuById(id) - GET: Fetch a customer menu by ID
 * updateCustomerMenu(id) - POST: Update a customer menu by ID
 * deleteCustomerMenu(id) - POST: Delete a customer menu by ID
 */
export const createFormField = `hub/teller/create-form-field`;
export const deleteFormField = (fieldId: number): string => `hub/teller/delete-form-field/${fieldId}`;
export const updateFormField = (fieldId: number): string => `hub/teller/update-form-field/${fieldId}`;
export const getFormField = `hub/teller/get-form-fields`;
export const creatCustomerMenu = `hub/teller/create-customer-menu`;
export const getCustomerMenu = `hub/teller/get-customer-menus`;
export const getCustomerMenuById = (menu_id: number): string => `hub/teller/get-customer-menu/${menu_id}`;
export const updateCustomerMenu = (menu_id: number): string => `hub/teller/update-customer-menu/${menu_id}`;
export const deleteCustomerMenu = (menu_id: number): string => `hub/teller/delete-customer-menu/${menu_id}`;

/** External Menu Link
 *
 * createExternalLink - POST: Create a new external menu link
 * getExternalLink - GET: Fetch external menu link(s)
 * updateExternalLink(id) - POST: Update external menu link by ID
 * deleteExternalLink(id) - POST: Delete external menu link by ID
 */
export const createExternalLink = `hub/teller/create-external-link`;
export const getExternalLink = `hub/teller/external-link`;
export const updateExternalLink = (id: number): string => `hub/teller/update-external-link/${id}`;
export const deleteExternalLink = (id: number): string => `hub/teller/delete-external-link/${id}`;

/** Notification Teller
 *
 * getNotificationList - GET: Fetch the list of notifications
 * markAsReadNotification(id) - POST: Mark a specific notification as read
 */
export const getNotificationList = `hub/notification/get-notification`;
export const markAsReadNotification = (id: number): string => `hub/notification/mark-as-read/${id}`;

/** Print Config APIs
 *
 * getAllPrintConfigs - GET: Fetch all print configurations
 * createPrintConfig - POST: Create a new print configuration
 * updatePrintConfig(id) - POST: Update an existing print configuration by ID
 * deletePrintConfig(id) - POST: Delete a print configuration by ID
 */
export const getAllPrintConfigs = `hub/teller/get-all-print-configs`;
export const createPrintConfig = `hub/teller/create-print-config`;
export const updatePrintConfig = (id: number | string): string => `hub/teller/update-print-config/${id}`;
export const deletePrintConfig = `hub/teller/delete-print-config`;

/** Staff Management APIs
 *
 * getUserEndPoint - GET: Fetch all users
 * archiveUser - POST: Archive a user
 * restoreUser - POST: Restore a user
 * genderList - GET: Get list of genders
 * userRoleList - GET: Get list of user roles
 * createUserEndPoint - POST: Register a new user
 * updateUserEndPoint(id) - PUT: Update user details by ID
 */
export const getUserEndPoint = `hub/users`;
export const archiveUser = `hub/user/archive`;
export const restoreUser = `hub/user/restore`;
export const genderList = `hub/gender`;
export const userRoleList = `hub/roles`;
export const createUserEndPoint = `auth/register`;
export const functionalities = `hub/functionalities`;
export const addRole = `hub/addrole`;
export const updateUserEndPoint = (id: number): string => `hub/users/${id}`;

/** System Request APIs
 *
 * getRequestApiEndPoint - GET: Fetch pending system requests
 * rejectSystemRequestApiEndPoint - POST: Reject a system request
 * systemApproveRequest - POST: Approve a system request
 */
export const getRequestApiEndPoint = `hub/branch/getPendingRequests`;
export const rejectSystemRequestApiEndPoint = `hub/branch/reject-request`;
export const systemApproveRequest = `hub/branch/approve-request`;

/** Till, Safe and Terminal Management APIs
 *
 * createTillApiEndPoint - POST: Create a till
 * createTerminalApiEndPoint - POST: Create a terminal
 * getSafeAndTillByBranch(id) - GET: Fetch safes and tills for a branch
 * getTerminalByBranch(id) - GET: Fetch terminals for a branch
 * getUnassignedTill(id) - GET: Get unassigned tills by branch
 * getUnassignedTerminal(id) - GET: Get unassigned terminals by branch
 * removeMachineFromTill(id) - POST: Remove machine from till
 * removeMachineFromTerminal(id) - POST: Remove machine from terminal
 * updateTerminalName(id) - POST: Update Terminal Name
 * updateTillName(id) - POST: Update Till Name
 */
export const createTillApiEndPoint = `hub/till/create`;
export const createTerminalApiEndPoint = `hub/terminal/createTerminal`;
export const getSafeAndTillByBranch = (branchId: number): string => `hub/branch/getBranchDevices/${branchId}`;
export const getTerminalByBranch = (branchId: number): string => `hub/terminal/getTerminalsByBranch/${branchId}`;
export const getUnassignedTill = (branchId: number): string => `hub/branch/getUnassignedTill/${branchId}`;
export const getUnassignedTerminal = (branchId: number): string => `hub/branch/getUnassignedTerminal/${branchId}`;
export const removeMachineFromTill = (tillId: number): string => `hub/till/removeMachineFromTill/${tillId}`;
export const removeMachineFromTerminal = (terminalId: number): string => `hub/terminal/removeMachineFromTerminal/${terminalId}`;
export const updateTerminalName = (terminalId: number): string => `hub/terminal/updateTerminal/${terminalId}`;
export const updateTillName = (tillId: number): string => `hub/teller/updateTill/${tillId}`;

//two factor authentication
export const sendtwoFactorAuthOtpEndPoint = `auth/2fa/send-otp`;
export const verifytwoFactorAuthOtpEndPoint = `auth/2fa/verify`;

//product
export const getProductApi = (query: string): string => `hub/products?obj=` + JSON.stringify(query)
export const getActiveProducts = (query: string): string => `hub/getactiveproducts?obj=` + JSON.stringify(query);
export const createProductApi = `hub/addproduct`;
export const updateProductApi = `hub/updateproduct`;
export const deleteProductApi = `hub/deleteproducts`;
export const mainProductApi = `hub/corebankingproductstructure`;
export const productTypeApi = `hub/types`;
export const getUnassignedSubProducts = `hub/getunassignedsubproducts`;
export const parentProductApi = `hub/getparentproducts`;
export const getCustomerbyproductid = `hub/getcustomerbyproductid`;
export const updateSubProducts = `hub/updateSubProducts`;
export const updateProductStatus = `hub/updateproductstatus`;
export const archiveProduct = `hub/getallsubproducts`;
export const configSubProduct = `hub/getunassignedsubproducts`;

//Staff Management
export const createUserEndPointAO = `hub/auth/register`;
export const getUserEndPointAO = `hub/getuser`;
export const getuserarchive = `hub/getuser/archive`;  //new arcive api endpoint
// export const getuseractive = `hub/getuser`;
export const archiveUserAO = `hub/archive`;
export const activeUser = `hub/restore`;
export const getroles = `hub/getroles`;
export const getuserbyid = `hub/getaudittrailbyuserid`;
export const updateuser = `hub/updateuser`;
export const archiveuser = `hub/archive`;
export const activeuser = `hub/restore`;
export const adduser = `hub/adduser`;
export const loadaudit = `hub/loadaudit`;
export const addrole = `hub/addrole`;
export const deleterole = `hub/deleterole`;
export const rolesetting = `hub/rolessetting`;

//New Onboarding
export const getNewAccountOnboardingApi = (query: string): string => `hub/getnewcustomerlist?obj=` + JSON.stringify(query);
export const getProductApplicationApi = (query: string): string => `hub/getproductapplicationdetails?obj=` + JSON.stringify(query);
export const getProductApplicationMailerApi = (query: string): string => `hub/getproductapplicationmailer/?obj=` + JSON.stringify(query);
export const getNewAccountOnboardingMailerApi = (query: string): string => `hub/getnewaccountmailerlist/product?obj=` + JSON.stringify(query);
export const getRegLetterApi = (query: string): string => `hub/getnewaccountmailerlist/onboarding?obj=` + JSON.stringify(query);
export const getnewaccountaudits = `hub/getnewaccountaudits`;
export const updateCustAppStatus = `hub/updatenewaccountstatestatus`;
export const approveDoc = `hub/insertnewaccountwithoutcallcredit`;
export const getcustomerLetter = `hub/getnewaccountletterdata`;
export const getCustDocuments = `hub/getdocuments`;
export const deleteOnboarding = `hub/deleteonboarding`;
export const blockUnblockNewOnboardingCust = `hub/blockexistingcustomer`;

//existing onboarding
export const getexistingOnboardingApi = (query: string): string => `hub/getnewaccountslist?obj=` + JSON.stringify(query);
export const blockUnblockExistingOnboardingCust = `hub/updatecreateaccount`;

//Dashboard
export const dashboardDetailApiEndPoint = `hub/getdashboard`;
export const dashboardDateSearchDetailApiEndPoint = `hub/getdashboardreport`;
export const dashboardgetplatformstatistics = `hub/getplatformstatistics`;


//customer
export const customerSearchApiEndpoint = `hub/searchcustomer`;
export const deleteCustomerApiEndpoint = `hub/deleteallcustomers`;
export const updateCustomerStatusApiEndpoint = `hub/updatecustomerstatusv2`;
export const deleteCustomerByReferencenApiEndpoint = `hub/delcustomerbyreference`;

//faqs-category
export const getFaqCategoriesEndpoint = `hub/getallcategories`;
export const getFaqCatApi = (query: string): string => `hub/getallcategories?obj=` + JSON.stringify(query)
export const createFaqCategoryEndpoint = `hub/addcategories`;
export const updateFaqCategoryEndpoint = `hub/editcategory`;
export const deleteFaqCategoryEndpoint = `hub/deletefaqcategory`;

//faqs
export const getFaqsEndpoint = `hub/getfaq`;
export const getFaqApi = (query: string): string => `hub/getfaq?obj=` + JSON.stringify(query)
export const createFaqEndpoint = `hub/addfaq`;
export const updateFaqStatusEndpoint = `hub/updatefaqstatus`;
export const updateFaqEndpoint = `hub/updatefaq`;
export const deleteFaqEndpoint = `hub/deletefaqs`;

//contacus

export const contactusEndpoint = `hub/getcustomercomplaint`;
// export const getContactApi = `hub/getcustomercomplaint`;
export const getContactApi = (query: string): string => `hub/getcustomercomplaint?obj=` + JSON.stringify(query)
export const archiveEndpoint = `hub/archivecomplaints`;
export const getMessagesEndpoint = 'hub/getcontactusmessagebyid';
export const sendMessageEndpoint = 'hub/sendmessagetocustomer';


//app-setting
export const getBranchesEndpoint = `hub/getbranch`;
export const addBranchesEndpoint = `hub/addbranch`;
export const updateBankSettings = `hub/updatebanksettings`
export const deleteBranchesEndpoint = `hub/deletebranches`;
export const updateBranchesEndpoint = `hub/updatebranch`;
export const getSmsMessagesEndpoint = (query: string): string => `hub/getsms?obj=` + JSON.stringify(query);
export const updateSmsMessageEndpoint = `hub/updatesms`;
export const createSmsMessageEndpoint = `hub/createsms`;
export const deleteSmsMessageEndpoint = `hub/deletesms`;
export const getProductsInformationEndpoint = (query: string): string => `hub/getproductsinformation?obj=` + JSON.stringify(query);
export const addProductInformationEndpoint = `hub/addproductsinformation`;
export const updateProductsInformationEndpoint = `hub/updateproductsinformation`;
export const getTermsAndConditionEndpoint = `hub/gettermsandcondition`;
export const updateTermsAndConditionEndpoint = `hub/update`;

export const updateOnboardingTncEndpoint = `hub/updateonboardingtnc`;
export const updateOnlineTncEndpoint = `hub/updateonlinetnc`;
export const updateTransferNoteEndpoint = `hub/updatetermsconditions`;
export const updateTransferInfoTncEndpoint = `hub/updatetransferinfotnc`;
export const updateProductTncEndpoint = `hub/updatetermsconditions`;
export const updateFcssTermsAndConditionEndpoint = `hub/updatenewaccountnc`;
export const updateProductInformationStatusEndpoint = 'hub/archiveactiveproductsinformation';



///campign master
export const getAllCampaignMasterEndpoint = (query: string): string => `hub/getallcampaignmaster?obj=` + JSON.stringify(query);
export const getAllArchivedCampaignMasterEndpoint = (query: string): string => `hub/getallcampaignmaster?obj=` + JSON.stringify(query);
export const addCampaignMasterEndpoint = `hub/addcampaignmaster`;
export const getCampaignDropdownEndpoint = `hub/getcampaigndropdown`;
export const updateCampaignMasterEndpoint = `hub/updatecampaignmaster`;

export const updateCampaignStatusEndpoint = `hub/archievecampaignmaster`;
export const activeCampaignMasterEndpoint = `hub/activecampaignmaster`;




///super admin
export const getBankSettingsEndpoint = `hub/getbanksettings`;
export const getAppVersionEndpoint = (query: string): string => `hub/getappversion?obj=` + JSON.stringify(query);
export const updateAppVersionEndpoint = `hub/updateappversion`;

// screen lable
export const getScreenLabel = `hub/getlabelsjson`;
export const updateAppLabels = `hub/updateapplabels`;
export const updateOnlineLabels = `hub/updateonlinelabels`;



////marketing push messages
export const getPushMessagesEndpoint = (query: string): string => `hub/getmessages`;
export const getDraftedPushMessagesEndpoint = (query: string): string => `hub/getisdraftedpushmessages?obj=` + JSON.stringify(query);
export const addMessageEndpoint = `hub/addmessage`;

export const getCustomerByMessagesIdEndpoint = `hub/getcustomerbymessagesid`;
export const updateMessageEndpoint = `hub/updatemessage`;



//existing customer


//API Logs
export const getAPIlogs = (query: string): string => `hub/apiaudittrails?obj=` + JSON.stringify(query);
export const getAPItypes = `hub/apilog/dropdown`;

//stop api

export const stopapi = `hub/enableapis`;
export const stopsopraapi = `hub/updatesopraconfig`;
export const loadAudit = `hub/loadaudit`;
