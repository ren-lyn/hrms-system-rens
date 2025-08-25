# HRMS Use Case Diagrams and Descriptions

## System Actors

### Primary Actors
1. **Super Administrator** - System administrator with full access
2. **HR Administrator** - HR staff managing employee records and processes
3. **HR Manager** - HR management overseeing HR operations
4. **Department Manager** - Managers overseeing their team members
5. **Employee** - Regular employees using self-service features
6. **Payroll Officer** - Staff responsible for payroll processing

### Secondary Actors
1. **Email System** - External email service for notifications
2. **SMS Gateway** - External SMS service for alerts
3. **Biometric System** - External attendance tracking devices
4. **Government Systems** - External systems for tax reporting

## Core Use Cases by Module

### 1. Authentication & Authorization Module

#### UC-AA-001: User Login
**Actor**: All Users  
**Precondition**: User has valid credentials  
**Main Flow**:
1. User enters email and password
2. System validates credentials
3. System checks user status (active/inactive)
4. System generates session token
5. System redirects to appropriate dashboard

**Alternative Flow**:
- Invalid credentials: Display error message
- Inactive account: Display account suspended message
- First-time login: Force password change

#### UC-AA-002: Role-Based Access Control
**Actor**: System  
**Precondition**: User is authenticated  
**Main Flow**:
1. User attempts to access a resource
2. System checks user roles and permissions
3. System grants or denies access based on permissions
4. System logs access attempt

### 2. Employee Management Module

#### UC-EM-001: Create Employee Record
**Actor**: HR Administrator, HR Manager  
**Precondition**: User has employee management permissions  
**Main Flow**:
1. User navigates to employee creation form
2. User enters employee personal information
3. User assigns department and position
4. User sets salary grade and employment details
5. System validates input data
6. System creates employee record
7. System sends welcome email to employee

**Exception Flow**:
- Duplicate employee ID: Display error and suggest alternative
- Invalid data: Highlight validation errors

#### UC-EM-002: Update Employee Information
**Actor**: HR Administrator, HR Manager, Employee (limited)  
**Precondition**: Employee record exists  
**Main Flow**:
1. User searches for employee or accesses own profile
2. System displays employee information
3. User modifies allowed fields
4. System validates changes
5. System updates employee record
6. System logs changes in audit trail

#### UC-EM-003: View Employee Profile
**Actor**: All Users (with appropriate permissions)  
**Precondition**: Employee record exists  
**Main Flow**:
1. User searches for employee or accesses own profile
2. System displays employee information based on user permissions
3. User can view allowed sections (personal, employment, documents)

### 3. Attendance Management Module

#### UC-AM-001: Record Attendance
**Actor**: Employee, Biometric System  
**Precondition**: Employee is active and has work schedule  
**Main Flow**:
1. Employee checks in using web interface or biometric device
2. System records timestamp and location
3. System validates against work schedule
4. System updates attendance record
5. System calculates work hours at check-out

**Alternative Flow**:
- Late arrival: Mark as late and notify supervisor
- Early departure: Require approval from manager

#### UC-AM-002: View Attendance Records
**Actor**: Employee, Department Manager, HR Staff  
**Precondition**: Attendance records exist  
**Main Flow**:
1. User selects date range for attendance view
2. System retrieves attendance records based on user permissions
3. System displays attendance summary with work hours, overtime, and status

#### UC-AM-003: Approve Attendance Corrections
**Actor**: Department Manager, HR Administrator  
**Precondition**: Attendance correction request exists  
**Main Flow**:
1. Manager receives notification of correction request
2. Manager reviews request details and justification
3. Manager approves or rejects correction
4. System updates attendance record if approved
5. System notifies employee of decision

### 4. Leave Management Module

#### UC-LM-001: Apply for Leave
**Actor**: Employee  
**Precondition**: Employee has sufficient leave balance  
**Main Flow**:
1. Employee accesses leave application form
2. Employee selects leave type and dates
3. System checks leave balance and policies
4. Employee provides reason for leave
5. System submits application to manager
6. System sends notification to approver

**Exception Flow**:
- Insufficient balance: Display error and available balance
- Policy violation: Display policy restrictions

#### UC-LM-002: Approve/Reject Leave Application
**Actor**: Department Manager, HR Administrator  
**Precondition**: Leave application exists and is pending  
**Main Flow**:
1. Manager receives leave application notification
2. Manager reviews application details
3. Manager checks team coverage and workload
4. Manager approves or rejects with comments
5. System updates leave balance if approved
6. System notifies employee of decision

#### UC-LM-003: View Leave Balance
**Actor**: Employee, Department Manager, HR Staff  
**Precondition**: Leave balances are configured  
**Main Flow**:
1. User accesses leave balance view
2. System displays current year leave balances by type
3. System shows used, remaining, and carried forward leaves
4. System displays leave history

### 5. Payroll Management Module

#### UC-PM-001: Process Payroll
**Actor**: Payroll Officer, HR Administrator  
**Precondition**: Payroll period is defined and attendance data is complete  
**Main Flow**:
1. Officer selects payroll period for processing
2. System calculates salaries based on attendance and components
3. System applies deductions and tax calculations
4. Officer reviews payroll calculations
5. Officer approves and finalizes payroll
6. System generates payslips
7. System updates employee payroll records

#### UC-PM-002: Generate Payslip
**Actor**: System (automated), Payroll Officer  
**Precondition**: Payroll is processed for the period  
**Main Flow**:
1. System generates individual payslips
2. System includes salary breakdown, deductions, and net pay
3. System saves payslips in employee records
4. System sends payslips to employees via email

#### UC-PM-003: View Payroll Reports
**Actor**: Payroll Officer, HR Manager, Super Administrator  
**Precondition**: Payroll data exists  
**Main Flow**:
1. User selects reporting period and filters
2. System generates payroll summary reports
3. System displays total costs, deductions, and statistics
4. User can export reports in various formats

### 6. Performance Management Module

#### UC-PFM-001: Create Performance Goals
**Actor**: Employee, Department Manager  
**Precondition**: Performance cycle is active  
**Main Flow**:
1. Manager or employee creates performance goals
2. User defines goal description, targets, and weights
3. System validates goal criteria
4. System saves goals for the performance cycle
5. System notifies relevant parties

#### UC-PFM-002: Conduct Performance Review
**Actor**: Department Manager, Employee, Peers  
**Precondition**: Performance cycle is in review phase  
**Main Flow**:
1. Reviewer accesses performance review form
2. Reviewer evaluates goals achievement and competencies
3. Reviewer provides ratings and comments
4. System calculates overall performance score
5. System submits review for approval
6. System generates performance report

#### UC-PFM-003: View Performance Analytics
**Actor**: HR Manager, Department Manager  
**Precondition**: Performance reviews are completed  
**Main Flow**:
1. User accesses performance analytics dashboard
2. System displays performance trends and distributions
3. System shows goal achievement rates
4. System provides insights for talent management

### 7. Recruitment & Onboarding Module

#### UC-RO-001: Post Job Opening
**Actor**: HR Administrator, HR Manager  
**Precondition**: Position vacancy exists  
**Main Flow**:
1. User creates job posting with requirements
2. User sets application deadline and salary range
3. System publishes job posting
4. System tracks application submissions
5. System sends notifications to hiring team

#### UC-RO-002: Manage Job Applications
**Actor**: HR Administrator, HR Manager  
**Precondition**: Job applications exist  
**Main Flow**:
1. User reviews submitted applications
2. User screens applications based on criteria
3. User scores and ranks candidates
4. User schedules interviews
5. System tracks candidate progress through hiring stages

#### UC-RO-003: Onboard New Employee
**Actor**: HR Administrator, Department Manager  
**Precondition**: Employee is hired  
**Main Flow**:
1. System creates onboarding checklist
2. System assigns tasks to relevant stakeholders
3. Stakeholders complete onboarding tasks
4. System tracks completion progress
5. System notifies when onboarding is complete

### 8. Reporting & Analytics Module

#### UC-RA-001: Generate Standard Reports
**Actor**: HR Staff, Managers  
**Precondition**: Relevant data exists in system  
**Main Flow**:
1. User selects report type and parameters
2. System retrieves and processes data
3. System generates report in requested format
4. User can view, download, or schedule report

#### UC-RA-002: Create Custom Reports
**Actor**: HR Manager, Super Administrator  
**Precondition**: User has report creation permissions  
**Main Flow**:
1. User accesses report builder interface
2. User selects data sources and fields
3. User applies filters and grouping
4. User previews report layout
5. System saves custom report template

#### UC-RA-003: View Analytics Dashboard
**Actor**: All Users (role-based views)  
**Precondition**: User is authenticated  
**Main Flow**:
1. User accesses dashboard
2. System displays role-appropriate metrics and KPIs
3. System shows real-time and historical data
4. User can drill down into specific metrics

### 9. Self-Service Portal Module

#### UC-SS-001: Update Personal Information
**Actor**: Employee  
**Precondition**: Employee account is active  
**Main Flow**:
1. Employee accesses personal profile
2. Employee updates allowed personal information
3. System validates input data
4. System saves changes
5. System notifies HR if approval is required

#### UC-SS-002: Access Payslips and Tax Documents
**Actor**: Employee  
**Precondition**: Payroll records exist  
**Main Flow**:
1. Employee accesses payroll section
2. System displays available payslips and tax documents
3. Employee can view and download documents
4. System logs document access

#### UC-SS-003: View Team Information
**Actor**: Department Manager  
**Precondition**: Manager has team members  
**Main Flow**:
1. Manager accesses team dashboard
2. System displays team member information
3. System shows team attendance, leave status, and performance
4. Manager can drill down into individual employee details

### 10. Predictive Analytics Module

#### UC-PA-001: Analyze Turnover Risk
**Actor**: HR Manager, System (automated)  
**Precondition**: Historical employee data exists  
**Main Flow**:
1. System analyzes attendance patterns and performance data
2. System applies machine learning algorithms
3. System identifies employees at risk of turnover
4. System generates risk scores and recommendations
5. System alerts HR managers to high-risk employees

#### UC-PA-002: Generate Workforce Insights
**Actor**: HR Manager, Senior Management  
**Precondition**: Sufficient historical data exists  
**Main Flow**:
1. User requests workforce analytics
2. System analyzes trends in hiring, performance, and retention
3. System identifies patterns and correlations
4. System generates insights and recommendations
5. System presents findings in visual dashboards

## Cross-Cutting Use Cases

### UC-CC-001: Audit Trail Management
**Actor**: System (automated)  
**Precondition**: User performs any significant action  
**Main Flow**:
1. System captures user action details
2. System records timestamp, user, and changes made
3. System stores audit information securely
4. System provides audit trail reports for compliance

### UC-CC-002: Notification Management
**Actor**: System (automated)  
**Precondition**: Triggering event occurs  
**Main Flow**:
1. System detects notification trigger
2. System determines notification recipients
3. System sends notifications via email/SMS
4. System tracks notification delivery status
5. System provides notification history

### UC-CC-003: Data Export/Import
**Actor**: Super Administrator, HR Administrator  
**Precondition**: User has data management permissions  
**Main Flow**:
1. User selects data export/import function
2. User specifies data scope and format
3. System processes data operation
4. System validates data integrity
5. System provides operation status and logs