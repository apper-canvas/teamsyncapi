import React from 'react';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmployeeCard = ({ employee, onEdit, onArchive, departments }) => {
  const department = departments?.find(d => d.Id === employee.departmentId);
  
  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      archived: "danger"
    };
    return variants[status] || "default";
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={employee.photoUrl}
            alt={`${employee.firstName} ${employee.lastName}`}
            fallback={getInitials(employee.firstName, employee.lastName)}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
            <p className="text-xs text-gray-500">{department?.name || "Unknown Department"}</p>
          </div>
        </div>
        <Badge variant={getStatusBadge(employee.status)}>
          {employee.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="w-4 h-4" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="w-4 h-4" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="secondary" 
          size="sm" 
          leftIcon="Edit"
          onClick={() => onEdit(employee)}
          className="flex-1"
        >
          Edit
        </Button>
        {employee.status === "active" && (
          <Button 
            variant="danger" 
            size="sm" 
            leftIcon="Archive"
            onClick={() => onArchive(employee)}
          >
            Archive
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;