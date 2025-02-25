export interface Organization {
  id: string;
  name: string;
  slug: string;
  app_name: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationStats {
  totalEmployees: number;
  totalDepartments: number;
  activeEmployees: number;
  newHires: number;
}

export interface OrganizationFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  perPage: number;
}
