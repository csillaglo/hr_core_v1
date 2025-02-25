import { useParams } from 'react-router-dom';
import { RequireAuth } from '../../components/auth/RequireAuth';
import { OrganizationDetails } from '../../components/organizations/OrganizationDetails';

export const OrganizationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <RequireAuth allowedRoles={['superadmin']}>
      <div className="container mx-auto py-8">
        <OrganizationDetails />
      </div>
    </RequireAuth>
  );
};
