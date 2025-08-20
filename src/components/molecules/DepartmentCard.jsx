import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DepartmentCard = ({ department, onEdit, onDelete, headName }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
            <p className="text-sm text-gray-600">{department.memberCount} members</p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {department.description}
      </p>

      {headName && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <ApperIcon name="User" className="w-4 h-4" />
          <span>Head: {headName}</span>
        </div>
      )}

      <div className="flex space-x-2">
        <Button 
          variant="secondary" 
          size="sm" 
          leftIcon="Edit"
          onClick={() => onEdit(department)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          leftIcon="Trash2"
          onClick={() => onDelete(department)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DepartmentCard;