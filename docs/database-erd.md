# HRMS Database Entity Relationship Diagram

## Core Entities and Relationships

### 1. User Management Entities

#### Users
```
users
├── id (PK)
├── email (unique)
├── email_verified_at
├── password
├── remember_token
├── created_at
├── updated_at
└── deleted_at
```

#### Roles
```
roles
├── id (PK)
├── name
├── description
├── created_at
└── updated_at
```

#### Permissions
```
permissions
├── id (PK)
├── name
├── description
├── created_at
└── updated_at
```

#### Role_User (Many-to-Many)
```
role_user
├── id (PK)
├── user_id (FK → users.id)
├── role_id (FK → roles.id)
├── created_at
└── updated_at
```

#### Permission_Role (Many-to-Many)
```
permission_role
├── id (PK)
├── permission_id (FK → permissions.id)
├── role_id (FK → roles.id)
├── created_at
└── updated_at
```

### 2. Employee Management Entities

#### Employees
```
employees
├── id (PK)
├── user_id (FK → users.id)
├── employee_id (unique)
├── first_name
├── middle_name
├── last_name
├── birth_date
├── gender
├── civil_status
├── nationality
├── phone
├── address
├── emergency_contact_name
├── emergency_contact_phone
├── emergency_contact_relationship
├── hire_date
├── employment_status
├── position_id (FK → positions.id)
├── department_id (FK → departments.id)
├── manager_id (FK → employees.id)
├── salary_grade_id (FK → salary_grades.id)
├── profile_photo
├── created_at
├── updated_at
└── deleted_at
```

#### Departments
```
departments
├── id (PK)
├── name
├── description
├── manager_id (FK → employees.id)
├── parent_department_id (FK → departments.id)
├── created_at
├── updated_at
└── deleted_at
```

#### Positions
```
positions
├── id (PK)
├── title
├── description
├── department_id (FK → departments.id)
├── level
├── requirements
├── created_at
├── updated_at
└── deleted_at
```

#### Employee_Documents
```
employee_documents
├── id (PK)
├── employee_id (FK → employees.id)
├── document_type
├── document_name
├── file_path
├── uploaded_by (FK → users.id)
├── created_at
└── updated_at
```

### 3. Payroll Management Entities

#### Salary_Grades
```
salary_grades
├── id (PK)
├── grade_level
├── min_salary
├── max_salary
├── currency
├── created_at
└── updated_at
```

#### Payroll_Periods
```
payroll_periods
├── id (PK)
├── period_name
├── start_date
├── end_date
├── pay_date
├── status
├── created_at
└── updated_at
```

#### Payroll_Records
```
payroll_records
├── id (PK)
├── employee_id (FK → employees.id)
├── payroll_period_id (FK → payroll_periods.id)
├── basic_salary
├── overtime_amount
├── allowances
├── deductions
├── tax_amount
├── net_salary
├── status
├── processed_by (FK → users.id)
├── processed_at
├── created_at
└── updated_at
```

#### Salary_Components
```
salary_components
├── id (PK)
├── name
├── type (allowance/deduction)
├── calculation_method
├── is_taxable
├── is_active
├── created_at
└── updated_at
```

#### Employee_Salary_Components
```
employee_salary_components
├── id (PK)
├── employee_id (FK → employees.id)
├── salary_component_id (FK → salary_components.id)
├── amount
├── effective_date
├── end_date
├── created_at
└── updated_at
```

### 4. Attendance Management Entities

#### Attendance_Records
```
attendance_records
├── id (PK)
├── employee_id (FK → employees.id)
├── date
├── check_in_time
├── check_out_time
├── break_start_time
├── break_end_time
├── work_hours
├── overtime_hours
├── status
├── notes
├── created_at
└── updated_at
```

#### Work_Schedules
```
work_schedules
├── id (PK)
├── name
├── start_time
├── end_time
├── break_duration
├── days_of_week (JSON)
├── is_flexible
├── created_at
└── updated_at
```

#### Employee_Schedules
```
employee_schedules
├── id (PK)
├── employee_id (FK → employees.id)
├── work_schedule_id (FK → work_schedules.id)
├── effective_date
├── end_date
├── created_at
└── updated_at
```

### 5. Leave Management Entities

#### Leave_Types
```
leave_types
├── id (PK)
├── name
├── description
├── max_days_per_year
├── carry_forward_allowed
├── requires_approval
├── advance_notice_days
├── is_active
├── created_at
└── updated_at
```

#### Leave_Balances
```
leave_balances
├── id (PK)
├── employee_id (FK → employees.id)
├── leave_type_id (FK → leave_types.id)
├── year
├── allocated_days
├── used_days
├── remaining_days
├── carried_forward_days
├── created_at
└── updated_at
```

#### Leave_Applications
```
leave_applications
├── id (PK)
├── employee_id (FK → employees.id)
├── leave_type_id (FK → leave_types.id)
├── start_date
├── end_date
├── days_requested
├── reason
├── status
├── applied_at
├── approved_by (FK → employees.id)
├── approved_at
├── rejected_reason
├── created_at
└── updated_at
```

### 6. Performance Management Entities

#### Performance_Cycles
```
performance_cycles
├── id (PK)
├── name
├── start_date
├── end_date
├── status
├── created_by (FK → users.id)
├── created_at
└── updated_at
```

#### Performance_Goals
```
performance_goals
├── id (PK)
├── employee_id (FK → employees.id)
├── performance_cycle_id (FK → performance_cycles.id)
├── title
├── description
├── target_value
├── weight_percentage
├── status
├── created_at
└── updated_at
```

#### Performance_Reviews
```
performance_reviews
├── id (PK)
├── employee_id (FK → employees.id)
├── reviewer_id (FK → employees.id)
├── performance_cycle_id (FK → performance_cycles.id)
├── review_type (self/supervisor/peer)
├── overall_rating
├── goals_achievement
├── strengths
├── areas_for_improvement
├── comments
├── status
├── submitted_at
├── created_at
└── updated_at
```

### 7. Recruitment & Onboarding Entities

#### Job_Postings
```
job_postings
├── id (PK)
├── title
├── description
├── requirements
├── position_id (FK → positions.id)
├── department_id (FK → departments.id)
├── employment_type
├── salary_range_min
├── salary_range_max
├── location
├── status
├── posted_by (FK → users.id)
├── posted_at
├── deadline
├── created_at
└── updated_at
```

#### Job_Applications
```
job_applications
├── id (PK)
├── job_posting_id (FK → job_postings.id)
├── applicant_name
├── applicant_email
├── applicant_phone
├── resume_path
├── cover_letter
├── status
├── score
├── notes
├── applied_at
├── reviewed_by (FK → users.id)
├── reviewed_at
├── created_at
└── updated_at
```

#### Onboarding_Checklists
```
onboarding_checklists
├── id (PK)
├── employee_id (FK → employees.id)
├── task_name
├── description
├── assigned_to (FK → users.id)
├── due_date
├── status
├── completed_at
├── completed_by (FK → users.id)
├── notes
├── created_at
└── updated_at
```

### 8. System Entities

#### Audit_Logs
```
audit_logs
├── id (PK)
├── user_id (FK → users.id)
├── action
├── table_name
├── record_id
├── old_values (JSON)
├── new_values (JSON)
├── ip_address
├── user_agent
├── created_at
```

#### Notifications
```
notifications
├── id (PK)
├── user_id (FK → users.id)
├── type
├── title
├── message
├── data (JSON)
├── read_at
├── created_at
└── updated_at
```

#### System_Settings
```
system_settings
├── id (PK)
├── key
├── value (JSON)
├── description
├── updated_by (FK → users.id)
├── created_at
└── updated_at
```

## Entity Relationships Summary

1. **Users** → **Employees** (One-to-One)
2. **Employees** → **Departments** (Many-to-One)
3. **Employees** → **Positions** (Many-to-One)
4. **Employees** → **Salary_Grades** (Many-to-One)
5. **Employees** → **Manager** (Self-referencing Many-to-One)
6. **Employees** → **Attendance_Records** (One-to-Many)
7. **Employees** → **Leave_Applications** (One-to-Many)
8. **Employees** → **Leave_Balances** (One-to-Many)
9. **Employees** → **Payroll_Records** (One-to-Many)
10. **Employees** → **Performance_Reviews** (One-to-Many)
11. **Departments** → **Positions** (One-to-Many)
12. **Departments** → **Job_Postings** (One-to-Many)
13. **Job_Postings** → **Job_Applications** (One-to-Many)
14. **Users** → **Roles** (Many-to-Many)
15. **Roles** → **Permissions** (Many-to-Many)

## Database Constraints and Indexes

### Primary Keys
- All tables have auto-incrementing integer primary keys

### Foreign Key Constraints
- All foreign key relationships enforce referential integrity
- Soft deletes implemented where appropriate

### Unique Constraints
- `users.email`
- `employees.employee_id`
- `departments.name`
- `positions.title` (within department)

### Indexes
- Foreign key columns
- Frequently queried columns (email, employee_id, date fields)
- Composite indexes for common query patterns

### Soft Deletes
- Implemented on: employees, departments, positions, users
- Maintains data integrity for historical records