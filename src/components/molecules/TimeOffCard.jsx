import React from 'react';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format, parseISO } from 'date-fns';

const TimeOffCard = ({ request, employee, onApprove, onReject, showActions = false }) => {
  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger"
    };
    return variants[status] || "default";
  };

  const getTypeIcon = (type) => {
    const icons = {
      vacation: "Palmtree",
      sick: "Heart",
      personal: "User"
    };
    return icons[type] || "Calendar";
  };

  const formatDateRange = (startDate, endDate) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (startDate === endDate) {
      return format(start, 'MMM dd, yyyy');
    }
    
    return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={getTypeIcon(request.type)} className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
            </h3>
            <p className="text-sm text-gray-600 capitalize">{request.type} Leave</p>
          </div>
        </div>
        <Badge variant={getStatusBadge(request.status)}>
          {request.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>{formatDateRange(request.startDate, request.endDate)}</span>
        </div>
        
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <ApperIcon name="MessageSquare" className="w-4 h-4 mt-0.5" />
          <span>{request.reason}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Clock" className="w-4 h-4" />
          <span>Requested {format(parseISO(request.requestDate), 'MMM dd, yyyy')}</span>
        </div>

        {request.status === 'approved' && request.approvedBy && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <ApperIcon name="CheckCircle" className="w-4 h-4" />
            <span>Approved by {request.approvedBy}</span>
          </div>
        )}
      </div>

      {showActions && request.status === 'pending' && (
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon="Check"
            onClick={() => onApprove(request)}
            className="flex-1"
          >
            Approve
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            leftIcon="X"
            onClick={() => onReject(request)}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeOffCard;