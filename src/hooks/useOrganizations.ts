import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { Organization, OrganizationFilters, OrganizationStats } from '../types/organization';
import { toast } from 'react-hot-toast';

export const useOrganizations = (filters: OrganizationFilters) => {
  const queryClient = useQueryClient();

  const fetchOrganizations = async () => {
    let query = supabase
      .from('organizations')
      .select('*', { count: 'exact' });

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    }

    const { data, count, error } = await query
      .range(filters.page * filters.perPage, (filters.page + 1) * filters.perPage - 1);

    if (error) throw error;

    return { data, total: count || 0 };
  };

  const fetchStats = async (orgId: string): Promise<OrganizationStats> => {
    const [
      { count: totalEmployees },
      { count: totalDepartments },
      { count: activeEmployees },
      { count: newHires }
    ] = await Promise.all([
      supabase.from('employees').select('*', { count: 'exact' }).eq('organization_id', orgId),
      supabase.from('departments').select('*', { count: 'exact' }).eq('organization_id', orgId),
      supabase.from('employees').select('*', { count: 'exact' }).eq('organization_id', orgId).eq('status', 'active'),
      supabase.from('employees').select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .gte('hire_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    return {
      totalEmployees: totalEmployees || 0,
      totalDepartments: totalDepartments || 0,
      activeEmployees: activeEmployees || 0,
      newHires: newHires || 0
    };
  };

  const { data, isLoading, error } = useQuery(
    ['organizations', filters],
    fetchOrganizations
  );

  const createMutation = useMutation(
    async (newOrg: Partial<Organization>) => {
      const { data, error } = await supabase
        .from('organizations')
        .insert(newOrg)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organizations']);
        toast.success('Organization created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message);
      }
    }
  );

  const updateMutation = useMutation(
    async ({ id, ...updates }: Partial<Organization>) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organizations']);
        toast.success('Organization updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.message);
      }
    }
  );

  return {
    organizations: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    fetchStats
  };
};
