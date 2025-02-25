import { RequireAuth } from '../../components/auth/RequireAuth';
import { OrganizationList } from '../../components/organizations/OrganizationList';

export const OrganizationsPage = () => {
  return (
    <RequireAuth allowedRoles={['superadmin']}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Organizations</h1>
        <OrganizationList />
      </div>
    </RequireAuth>
  );
};
