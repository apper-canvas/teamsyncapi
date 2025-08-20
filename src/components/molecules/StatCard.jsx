import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  className = "" 
}) => {
  const getTrendColor = () => {
    if (!trend) return "";
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? "TrendingUp" : "TrendingDown";
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
              <ApperIcon name={getTrendIcon()} className="w-3 h-3" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;