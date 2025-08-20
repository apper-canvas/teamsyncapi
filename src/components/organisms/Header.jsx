import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/employees': 'Employees',
      '/departments': 'Departments',
      '/time-off': 'Time Off'
    };
    return titles[path] || 'TeamSync';
  };

  const showSearch = () => {
    return ['/employees', '/departments', '/time-off'].includes(location.pathname);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon="Menu"
            onClick={onMenuToggle}
            className="lg:hidden"
          />
          <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch() && (
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-64 hidden sm:block"
            />
          )}
          
          <Button variant="ghost" size="sm" leftIcon="Bell">
            <span className="sr-only">Notifications</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">HR Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;