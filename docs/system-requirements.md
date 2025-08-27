# HRMS System Requirements Analysis

## Project Objectives

The primary objective of this study is to develop a comprehensive Human Resource Management System (HRMS) for Cabuyao Concrete Development Corporation. This system aims to streamline HR processes, reduce administrative workload, enhance operational efficiency, and improve employee satisfaction by automating essential HR functions. The system will provide a centralized platform for secure employee data management, automated payroll processing, real-time attendance tracking, leave management, recruitment and onboarding, and predictive turnover analytics to support data-driven HR decisions.

### Specific System Objectives:

1. **Centralized HR Management System** - Develop a centralized HR management system that securely stores, organizes, and manages employee records with comprehensive data integrity and access controls.

2. **Automated Payroll Processing** - Implement an automated payroll processing system to minimize errors, reduce delays, and ensure accurate salary computations with support for multiple pay components and tax calculations.

3. **Real-time Attendance Tracking** - Establish a real-time attendance tracking system that allows for efficient monitoring of employee working hours, overtime calculations, and attendance pattern analysis.

4. **Employee Self-Service Portal** - Create an online employee self-service portal where employees can easily access their attendance records, request leave, update personal information, view payslips, and access company policies.

5. **Leave Management Module** - Implement a comprehensive leave management module that simplifies the process of filing, approving, and tracking employee leave requests while enforcing company policies and maintaining accurate leave balances.

6. **Automated Reporting System** - Generate automated reports for payroll summaries, attendance monitoring, leave records, and performance metrics to assist HR professionals in data-driven decision-making.

7. **Performance Evaluation Module** - Integrate a performance evaluation module that allows HR personnel to assess employee contributions, conduct 360-degree feedback, track goals, and generate comprehensive performance reports.

8. **Recruitment and Onboarding System** - Develop a recruitment and onboarding module including job posting mechanics, application tracking system (ATS), candidate assessment tools, interview scheduling, and comprehensive onboarding checklists to streamline the hiring process.

9. **Predictive Turnover Analytics** - Implement predictive turnover analytics that uses attendance, performance, and behavioral data to flag employees who are likely to resign, enabling proactive HR interventions and retention strategies.

10. **End-User System Evaluation** - Evaluate the proposed HR management system through comprehensive end-user feedback from HR staff and administrative personnel based on the ISO/IEC 25010:2023 criteria (functional suitability, performance efficiency, interaction capability, reliability, and security).

11. **Expert Technical Evaluation** - Assess the proposed HR management system through expert feedback from web developers and technical specialists based on the ISO/IEC 25010:2023 criteria (functional suitability, performance efficiency, security, and maintainability).

By integrating these key features, the system will ensure compliance with labor laws and company policies while promoting transparency and reducing manual errors in HR operations.

## 1. Functional Requirements

### 1.1 Employee Management
- **FR-EM-01**: System shall store and manage employee personal information
- **FR-EM-02**: System shall maintain employee employment history
- **FR-EM-03**: System shall support employee profile updates
- **FR-EM-04**: System shall manage employee organizational hierarchy
- **FR-EM-05**: System shall handle employee document management

### 1.2 Payroll Management
- **FR-PM-01**: System shall calculate salaries based on attendance and performance
- **FR-PM-02**: System shall manage salary components (basic, allowances, deductions)
- **FR-PM-03**: System shall generate payslips automatically
- **FR-PM-04**: System shall handle tax calculations and deductions
- **FR-PM-05**: System shall support multiple pay frequencies (monthly, bi-weekly)

### 1.3 Attendance Management
- **FR-AM-01**: System shall track employee check-in/check-out times
- **FR-AM-02**: System shall calculate work hours and overtime
- **FR-AM-03**: System shall monitor late arrivals and early departures
- **FR-AM-04**: System shall support multiple attendance methods (web, mobile, biometric)
- **FR-AM-05**: System shall handle attendance corrections and approvals

### 1.4 Leave Management
- **FR-LM-01**: System shall manage different leave types (sick, vacation, emergency)
- **FR-LM-02**: System shall handle leave applications and approvals
- **FR-LM-03**: System shall track leave balances and accruals
- **FR-LM-04**: System shall enforce leave policies and restrictions
- **FR-LM-05**: System shall generate leave reports and calendars

### 1.5 Performance Management
- **FR-PFM-01**: System shall manage performance evaluation cycles
- **FR-PFM-02**: System shall support 360-degree feedback
- **FR-PFM-03**: System shall track performance goals and achievements
- **FR-PFM-04**: System shall generate performance reports
- **FR-PFM-05**: System shall link performance to compensation

### 1.6 Recruitment & Onboarding
- **FR-RO-01**: System shall manage job postings and applications
- **FR-RO-02**: System shall provide applicant tracking system (ATS)
- **FR-RO-03**: System shall support candidate assessment and scoring
- **FR-RO-04**: System shall manage onboarding checklists and workflows
- **FR-RO-05**: System shall track recruitment metrics and analytics

### 1.7 Reporting & Analytics
- **FR-RA-01**: System shall generate payroll reports
- **FR-RA-02**: System shall generate attendance reports
- **FR-RA-03**: System shall generate leave reports
- **FR-RA-04**: System shall provide dashboard with key metrics
- **FR-RA-05**: System shall support custom report generation

### 1.8 Self-Service Portal
- **FR-SS-01**: Employees shall view their profile and payslips
- **FR-SS-02**: Employees shall apply for leaves online
- **FR-SS-03**: Employees shall view attendance records
- **FR-SS-04**: Employees shall update personal information
- **FR-SS-05**: Employees shall access company policies and documents

## 2. Non-Functional Requirements

### 2.1 Performance Requirements
- **NFR-P-01**: System shall support up to 1000 concurrent users
- **NFR-P-02**: Page load times shall not exceed 3 seconds
- **NFR-P-03**: Database queries shall execute within 2 seconds
- **NFR-P-04**: System shall handle 10,000 attendance records per day

### 2.2 Security Requirements
- **NFR-S-01**: System shall implement role-based access control
- **NFR-S-02**: System shall encrypt sensitive data at rest and in transit
- **NFR-S-03**: System shall maintain audit logs for all transactions
- **NFR-S-04**: System shall implement session management and timeout
- **NFR-S-05**: System shall comply with data protection regulations

### 2.3 Reliability Requirements
- **NFR-R-01**: System shall maintain 99.5% uptime
- **NFR-R-02**: System shall implement automated backup procedures
- **NFR-R-03**: System shall provide disaster recovery capabilities
- **NFR-R-04**: System shall handle graceful error recovery

### 2.4 Usability Requirements
- **NFR-U-01**: System shall provide intuitive user interface
- **NFR-U-02**: System shall be accessible on mobile devices
- **NFR-U-03**: System shall support multiple languages (English, Filipino)
- **NFR-U-04**: System shall provide comprehensive help documentation

### 2.5 Maintainability Requirements
- **NFR-M-01**: System shall follow coding standards and best practices
- **NFR-M-02**: System shall implement comprehensive logging
- **NFR-M-03**: System shall support automated testing
- **NFR-M-04**: System shall provide clear API documentation

## 3. System Constraints

### 3.1 Technical Constraints
- Must use Laravel framework for backend
- Must use React for frontend
- Must use MySQL database
- Must be deployable on Linux servers
- Must support modern web browsers

### 3.2 Business Constraints
- Budget limitations for third-party services
- Timeline constraints for implementation
- Integration requirements with existing systems
- Compliance with local labor laws and regulations

## 4. User Roles and Permissions

### 4.1 Super Administrator
- Full system access and configuration
- User management and role assignment
- System monitoring and maintenance

### 4.2 HR Administrator
- Employee management
- Payroll processing
- Leave approval
- Report generation

### 4.3 HR Manager
- Department-level employee management
- Performance evaluation oversight
- Recruitment management
- Analytics and reporting

### 4.4 Department Manager
- Team member management
- Leave approval for team
- Performance evaluation
- Attendance monitoring

### 4.5 Employee
- Self-service portal access
- Personal information updates
- Leave applications
- Attendance viewing

### 4.6 Payroll Officer
- Payroll processing
- Salary calculations
- Tax computations
- Payroll reporting

## 5. Integration Requirements

### 5.1 External Systems
- Email system for notifications
- SMS gateway for alerts
- Biometric devices for attendance
- Government systems for tax reporting

### 5.2 Data Migration
- Import existing employee data
- Historical payroll data
- Attendance records
- Leave balances

## 6. Evaluation Framework (ISO/IEC 25010:2023)

### 6.1 End-User Evaluation Criteria
The system will be evaluated through comprehensive end-user feedback from HR staff and administrative personnel based on the following ISO/IEC 25010:2023 criteria:

#### 6.1.1 Functional Suitability
- **Functional Completeness**: Degree to which the set of functions covers all specified tasks and user objectives
- **Functional Correctness**: Degree to which the system provides correct results with needed precision
- **Functional Appropriateness**: Degree to which functions facilitate accomplishment of specified tasks and objectives

#### 6.1.2 Performance Efficiency
- **Time Behavior**: Response, processing times, and throughput rates when performing functions
- **Resource Utilization**: Amounts and types of resources used when performing functions
- **Capacity**: Maximum limits of system parameters

#### 6.1.3 Interaction Capability
- **Appropriateness Recognizability**: Degree to which users can recognize system suitability for their needs
- **Learnability**: Degree to which the system can be used by specified users to achieve learning goals
- **Operability**: Degree to which the system has attributes that make it easy to operate and control
- **User Error Protection**: Degree to which the system protects users against making errors
- **User Interface Aesthetics**: Degree to which user interface enables pleasing and satisfying interaction
- **Accessibility**: Degree to which the system can be used by people with widest range of characteristics

#### 6.1.4 Reliability
- **Maturity**: Degree to which the system meets needs for reliability under normal operation
- **Availability**: Degree to which the system is operational and accessible when required for use
- **Fault Tolerance**: Degree to which the system operates as intended despite hardware/software faults
- **Recoverability**: Degree to which the system can recover data and re-establish desired state after interruption

#### 6.1.5 Security
- **Confidentiality**: Degree to which the system ensures that data is accessible only to authorized entities
- **Integrity**: Degree to which the system prevents unauthorized access to or modification of data
- **Non-repudiation**: Degree to which actions can be proven to have taken place
- **Authenticity**: Degree to which the identity of a subject or resource can be proved
- **Accountability**: Degree to which actions can be traced uniquely to the entity

### 6.2 Expert Technical Evaluation Criteria
The system will be assessed through expert feedback from web developers and technical specialists based on the following ISO/IEC 25010:2023 criteria:

#### 6.2.1 Functional Suitability (Technical Perspective)
- **API Completeness**: Degree to which all required APIs and endpoints are implemented
- **Business Logic Correctness**: Accuracy of implemented business rules and calculations
- **Integration Appropriateness**: Suitability of system integrations and data flows

#### 6.2.2 Performance Efficiency (Technical Analysis)
- **Algorithm Efficiency**: Computational complexity and optimization of core algorithms
- **Database Performance**: Query optimization and database design efficiency
- **Scalability**: System's ability to handle increased load and concurrent users
- **Resource Management**: Efficient use of CPU, memory, and storage resources

#### 6.2.3 Security (Technical Implementation)
- **Authentication Mechanisms**: Strength and implementation of user authentication
- **Authorization Controls**: Role-based access control implementation
- **Data Encryption**: Implementation of encryption for data at rest and in transit
- **Vulnerability Assessment**: Security testing and penetration testing results
- **Compliance Implementation**: Technical compliance with security standards

#### 6.2.4 Maintainability (Code Quality)
- **Modularity**: Degree to which the system is composed of discrete components
- **Reusability**: Degree to which system assets can be used in more than one context
- **Analysability**: Degree of effectiveness in assessing impact of intended changes
- **Modifiability**: Degree to which system can be effectively modified without introducing defects
- **Testability**: Degree of effectiveness in establishing test criteria and performing tests

### 6.3 Evaluation Methodology

#### 6.3.1 End-User Evaluation Process
1. **User Acceptance Testing (UAT)**: Structured testing sessions with HR staff
2. **Usability Testing**: Task-based evaluation of user interface and workflows
3. **Feedback Surveys**: Standardized questionnaires based on ISO/IEC 25010:2023 criteria
4. **Focus Groups**: Facilitated discussions with different user roles
5. **Performance Monitoring**: Real-world usage metrics and performance data

#### 6.3.2 Expert Technical Evaluation Process
1. **Code Review**: Static analysis of source code quality and architecture
2. **Security Assessment**: Vulnerability scanning and penetration testing
3. **Performance Testing**: Load testing and stress testing under various conditions
4. **Architecture Review**: Evaluation of system design and architectural decisions
5. **Best Practices Audit**: Assessment against industry standards and frameworks

#### 6.3.3 Evaluation Metrics and Scoring
- **Quantitative Metrics**: Response times, error rates, completion rates, system uptime
- **Qualitative Assessments**: User satisfaction scores, expert ratings, feedback analysis
- **Compliance Scoring**: ISO/IEC 25010:2023 criteria adherence ratings (1-5 scale)
- **Benchmarking**: Comparison against industry standards and similar systems
- **Improvement Recommendations**: Actionable insights for system enhancement