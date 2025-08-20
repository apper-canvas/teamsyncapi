import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import EmployeeCard from '@/components/molecules/EmployeeCard';
import EmployeeModal from '@/components/organisms/EmployeeModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Select from '@/components/atoms/Select';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';
import { toast } from 'react-toastify';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleArchiveEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to archive ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success('Employee archived successfully');
        loadEmployees();
      } catch (error) {
        toast.error('Failed to archive employee');
      }
    }
  };

  const handleModalSave = () => {
    loadEmployees();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.departmentId.toString() === departmentFilter;
    const matchesStatus = employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadEmployees} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        <Button leftIcon="UserPlus" onClick={handleAddEmployee}>
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employees..."
            className="flex-1"
          />
          
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.Id} value={dept.Id.toString()}>
                {dept.name}
              </option>
            ))}
          </Select>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-32"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredEmployees.length} of {employees.filter(emp => emp.status === statusFilter).length} {statusFilter} employees
        </span>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <Empty
          icon="Users"
          title="No employees found"
          message={searchTerm || departmentFilter ? 
            "Try adjusting your search or filter criteria." : 
            "Get started by adding your first team member."
          }
          actionLabel={!searchTerm && !departmentFilter ? "Add Employee" : undefined}
          onAction={!searchTerm && !departmentFilter ? handleAddEmployee : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.Id}
              employee={employee}
              departments={departments}
              onEdit={handleEditEmployee}
              onArchive={handleArchiveEmployee}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        employee={selectedEmployee}
        departments={departments}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Employees;