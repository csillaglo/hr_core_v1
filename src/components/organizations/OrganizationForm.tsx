import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Organization } from '../../types/organization';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  app_name: z.string().min(1, 'App name is required'),
  settings: z.record(z.any()).optional()
});

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: Partial<Organization>) => void;
  isLoading?: boolean;
}

export const OrganizationForm = ({
  organization,
  onSubmit,
  isLoading
}: OrganizationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: organization || {}
  });

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            label="Organization Name"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <Input
            label="Slug"
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>

        <div>
          <Input
            label="App Name"
            error={errors.app_name?.message}
            {...register('app_name')}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {organization ? 'Update' : 'Create'} Organization
          </Button>
        </div>
      </form>
    </Card>
  );
};
