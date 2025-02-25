import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { Table } from '../ui/Table';
import { AdvancedSearch } from '../ui/AdvancedSearch';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import { BulkActions } from './BulkActions';

export const EmployeeList = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    dateRange: undefined,
    sortBy: 'last_name',
    sortOrder: 'asc' as const,
    page: 0,
    perPage: 10
  });

  const {
    employees,
    total,
    isLoading,
    exportEmployees,
    importEmployees,
    bulkUpdate
  } = useEmployees(filters);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importEmployees(file);
    }
  };

  const columns = [
    {
      header: '',
      accessor: 'id',
      cell: (employee: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(employee.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, employee.id]);
            } else {
              setSelectedIds(selectedIds.filter(id => id !== employee.id));
            }
          }}
        />
      )
    },
    { header: 'Name', accessor: (row: any) => `${row.first_name} ${row.last_name}` },
    { header: 'Department', accessor: 'department.name' },
    { header: 'Position', accessor: 'position.title' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (employee: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/employees/${employee.id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
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
        <AdvancedSearch
          value={filters}
          onChange={setFilters}
        />
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button variant="secondary">
              Import CSV
            </Button>
          </label>
          <Button
            variant="secondary"
            onClick={exportEmployees}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/employees/new')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <BulkActions
          selectedIds={selectedIds}
          onAction={(action, value) => {
            bulkUpdate({ ids: selectedIds, updates: { [action]: value } });
            setSelectedIds([]);
          }}
        />
      )}

      <Table
        columns={columns}
        data={employees}
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
