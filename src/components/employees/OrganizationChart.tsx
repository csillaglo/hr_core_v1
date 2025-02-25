import { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from 'reactflow';
import { useEmployees } from '../../hooks/useEmployees';
import { Employee } from '../../types/employee';

const createNodes = (employees: Employee[]): Node[] => {
  return employees.map(employee => ({
    id: employee.id,
    type: 'employeeNode',
    data: {
      label: `${employee.first_name} ${employee.last_name}`,
      position: employee.position.title,
      department: employee.department.name
    },
    position: { x: 0, y: 0 } // Position will be calculated by layout algorithm
  }));
};

const createEdges = (employees: Employee[]): Edge[] => {
  return employees
    .filter(employee => employee.manager_id)
    .map(employee => ({
      id: `${employee.manager_id}-${employee.id}`,
      source: employee.manager_id!,
      target: employee.id,
      type: 'smoothstep'
    }));
};

export const OrganizationChart = () => {
  const { employees } = useEmployees({ page: 0, perPage: 1000 });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = useCallback(() => {
    const layoutedNodes = createNodes(employees);
    const layoutedEdges = createEdges(employees);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [employees, setNodes, setEdges]);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Handle node position update in database
    },
    []
  );

  const exportChart = () => {
    const svgElement = document.querySelector('.react-flow__renderer svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'organization-chart.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="h-[800px]">
      <div className="flex justify-end mb-4">
        <Button onClick={exportChart}>
          Export Chart
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onInit={onInit}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
