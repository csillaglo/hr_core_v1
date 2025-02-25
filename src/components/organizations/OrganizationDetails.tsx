import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useOrganizations } from '../../hooks/useOrganizations';
import { Card } from '../ui/Card';
import { Metric } from '../ui/Metric';
import { ActivityLog } from '../ui/ActivityLog';

export const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchStats } = useOrganizations({ page: 0, perPage: 1 });

  const { data: stats, isLoading: statsLoading } = useQuery(
    ['organization-stats', id],
    () => fetchStats(id!)
  );

  const { data: organization } = useQuery(
    ['organization', id],
    async () => {
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();
      return data;
    }
  );

  if (!organization) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric
          title="Total Employees"
          value={stats?.totalEmployees}
          isLoading={statsLoading}
        />
        <Metric
          title="Active Employees"
          value={stats?.activeEmployees}
          isLoading={statsLoading}
        />
        <Metric
          title="Departments"
          value={stats?.totalDepartments}
          isLoading={statsLoading}
        />
        <Metric
          title="New Hires (30 days)"
          value={stats?.newHires}
          isLoading={statsLoading}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p>{organization.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Slug</label>
            <p>{organization.slug}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">App Name</label>
            <p>{organization.app_name}</p>
          </div>
        </div>
      </Card>

      <ActivityLog
        organizationId={id!}
        className="mt-6"
      />
    </div>
  );
};
