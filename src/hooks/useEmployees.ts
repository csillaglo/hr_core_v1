import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { Employee, EmployeeFilters } from '../types/employee';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';

export const useEmployees = (filters: EmployeeFilters) => {
  const queryClient = useQueryClient();

  const fetchEmployees = async () => {
    let query = supabase
      .from('employees')
      .select(`
        *,
        department:departments(name),
        position:positions(title),
        manager:employees(first_name, last_name)
      `, { count: 'exact' });

    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.department) {
      query = query.eq('department_id', filters.department);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.dateRange) {
      query = query
        .gte('hire_date', filters.dateRange.from)
        .lte('hire_date', filters.dateRange.to);
    }

    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    }

    const { data, count, error } = await query
      .range(filters.page * filters.perPage, (filters.page + 1) * filters.perPage - 1);

    if (error) throw error;

    return { data, total: count || 0 };
  };

  const exportEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        department:departments(name),
        position:positions(title)
      `);

    if (error) throw error;

    const csv = Papa.unparse(data.map(employee => ({
      'First Name': employee.first_name,
      'Last Name': employee.last_name,
      'Email': employee.email,
      'Phone': employee.phone,
      'Department': employee.department.name,
      'Position': employee.position.title,
      'Hire Date': employee.hire_date,
      'Status': employee.status
    })));

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
  };

  const importEmployees = async (file: File) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          try {
            const { error } = await supabase
              .from('employees')
              .insert(results.data);
            
            if (error) throw error;
            queryClient.invalidateQueries(['employees']);
            toast.success('Employees imported successfully');
            resolve(results.data);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const { data, isLoading, error } = useQuery(
    ['employees', filters],
    fetchEmployees
  );

  const createMutation = useMutation(
    async (newEmployee: Partial<Employee>) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(newEmployee)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employees']);
        toast.success('Employee created successfully');
      }
    }
  );

  const updateMutation = useMutation(
    async ({ id, ...updates }: Partial<Employee>) => {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employees']);
        toast.success('Employee updated successfully');
      }
    }
  );

  const bulkUpdateMutation = useMutation(
    async ({ ids, updates }: { ids: string[], updates: Partial<Employee> }) => {
      const { error } = await supabase
        .from('employees')
        .update(updates)
        .in('id', ids);
      
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['employees']);
        toast.success('Employees updated successfully');
      }
    }
  );

  return {
    employees: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    exportEmployees,
    importEmployees
  };
};
