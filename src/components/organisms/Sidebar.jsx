import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Employees', href: '/employees', icon: 'Users' },
    { name: 'Departments', href: '/departments', icon: 'Building2' },
    { name: 'Time Off', href: '/time-off', icon: 'Calendar' }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
          isActive 
            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Users" className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">TeamSync</span>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="flex-shrink-0 px-4 pb-4">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Need Help?</p>
                <p className="text-xs text-gray-600">Contact HR Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Users" className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TeamSync</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 pt-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <div className="px-4 pb-4">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Need Help?</p>
                  <p className="text-xs text-gray-600">Contact HR Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;