export interface Employee {
  id: string;
  organization_id: string;
  department_id: string;
  position_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  manager_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  perPage: number;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  type: string;
  name: string;
  url: string;
  created_at: string;
}

export interface EmployeeHistory {
  id: string;
  employee_id: string;
  change_type: 'position' | 'department' | 'manager' | 'status';
  old_value: string;
  new_value: string;
  changed_by: string;
  created_at: string;
}
