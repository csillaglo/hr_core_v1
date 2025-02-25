import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../hooks/useOrganizations';
import { Organization } from '../../types/organization';
import { Table } from '../ui/Table';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';

export const OrganizationList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc' as const,
    page: 0,
    perPage: 10
  });

  const { organizations, total, isLoading } = useOrganizations(filters);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Slug', accessor: 'slug' },
    { header: 'App Name', accessor: 'app_name' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (org: Organization) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/organizations/${org.id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/organizations/${org.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput
          value={filters.search}
          onChange={(value) => setFilters(prev => ({ ...prev, search: value, page: 0 }))}
          placeholder="Search organizations..."
        />
        <Button
          variant="primary"
          onClick={() => navigate('/organizations/new')}
        >
          Add Organization
        </Button>
      </div>

      <Table
        columns={columns}
        data={organizations}
        isLoading={isLoading}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={(sortBy, sortOrder) => setFilters(prev => ({ ...prev, sortBy, sortOrder }))}
      />

      <Pagination
        currentPage={filters.page}
        pageSize={filters.perPage}
        total={total}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />
    </div>
  );
};
