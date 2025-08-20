import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '../../App';

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/employees':
        return 'Employees';
      case '/departments':
        return 'Departments';
      case '/time-off':
        return 'Time Off';
      default:
        return 'TeamSync';
    }
  };

  const showSearch = () => {
    return ['/employees', '/departments', '/time-off'].includes(location.pathname);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch() && (
            <div className="hidden sm:block">
              <SearchBar
                placeholder={`Search ${getPageTitle().toLowerCase()}...`}
                className="w-64"
              />
            </div>
          )}

          {/* User menu */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {user.firstName?.charAt(0) || user.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName || user.emailAddress || 'User'}
                </span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              leftIcon="LogOut"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;