import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import DepartmentCard from '@/components/molecules/DepartmentCard';
import DepartmentModal from '@/components/organisms/DepartmentModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { departmentService } from '@/services/api/departmentService';
import { employeeService } from '@/services/api/employeeService';
import { toast } from 'react-toastify';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (department) => {
    const employeesInDept = employees.filter(emp => emp.departmentId === department.Id && emp.status === 'active');
    
    if (employeesInDept.length > 0) {
      toast.error(`Cannot delete department with ${employeesInDept.length} active employees. Please reassign them first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      try {
        await departmentService.delete(department.Id);
        toast.success('Department deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const handleModalSave = () => {
    loadData();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  // Get department head name
  const getDepartmentHeadName = (headId) => {
    if (!headId) return null;
    const head = employees.find(emp => emp.Id === headId);
    return head ? `${head.firstName} ${head.lastName}` : null;
  };

  // Filter departments
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Organize your team into departments and assign leadership</p>
        </div>
        <Button leftIcon="Plus" onClick={handleAddDepartment}>
          Add Department
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search departments..."
          className="max-w-md"
        />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredDepartments.length} of {departments.length} departments
        </span>
      </div>

      {/* Department Grid */}
      {filteredDepartments.length === 0 ? (
        <Empty
          icon="Building2"
          title="No departments found"
          message={searchTerm ? 
            "Try adjusting your search criteria." : 
            "Get started by creating your first department."
          }
          actionLabel={!searchTerm ? "Add Department" : undefined}
          onAction={!searchTerm ? handleAddDepartment : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map(department => (
            <DepartmentCard
              key={department.Id}
              department={department}
              headName={getDepartmentHeadName(department.headId)}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        department={selectedDepartment}
        employees={employees}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Departments;