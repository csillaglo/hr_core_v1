import { useNavigate } from 'react-router-dom';
import { RequireAuth } from '../../components/auth/RequireAuth';
import { OrganizationForm } from '../../components/organizations/OrganizationForm';
import { useOrganizations } from '../../hooks/useOrganizations';

export const NewOrganizationPage = () => {
  const navigate = useNavigate();
  const { create } = useOrganizations({ page: 0, perPage: 1 });

  const handleSubmit = async (data: any) => {
    await create(data);
    navigate('/organizations');
  };

  return (
    <RequireAuth allowedRoles={['superadmin']}>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create Organization</h1>
        <OrganizationForm onSubmit={handleSubmit} />
      </div>
    </RequireAuth>
  );
};
