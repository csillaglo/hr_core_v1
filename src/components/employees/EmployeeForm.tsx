import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee } from '../../types/employee';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FileUpload } from '../ui/FileUpload';
import { Card } from '../ui/Card';

const employeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department_id: z.string().min(1, 'Department is required'),
  position_id: z.string().min(1, 'Position is required'),
  hire_date: z.string().min(1, 'Hire date is required'),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
  manager_id: z.string().optional()
});

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: Partial<Employee>) => void;
  isLoading?: boolean;
}

export const EmployeeForm = ({
  employee,
  onSubmit,
  isLoading
}: EmployeeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {}
  });

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last Name"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Department"
            error={errors.department_id?.message}
            {...register('department_id')}
          />
          <Select
            label="Position"
            error={errors.position_id?.message}
            {...register('position_id')}
          />
        </div>

        <Input
          label="Hire Date"
          type="date"
          error={errors.hire_date?.message}
          {...register('hire_date')}
        />

        <Select
          label="Status"
          error={errors.status?.message}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'on_leave', label: 'On Leave' },
            { value: 'terminated', label: 'Terminated' }
          ]}
          {...register('status')}
        />

        <Select
          label="Manager"
          error={errors.manager_id?.message}
          {...register('manager_id')}
        />

        <FileUpload
          label="Documents"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={(files) => {
            // Handle file upload
          }}
        />

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
            {employee ? 'Update' : 'Create'} Employee
          </Button>
        </div>
      </form>
    </Card>
  );
};
