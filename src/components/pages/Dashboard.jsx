import React, { useState, useEffect } from 'react';
import StatCard from '@/components/molecules/StatCard';
import TimeOffCard from '@/components/molecules/TimeOffCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';
import { timeOffService } from '@/services/api/timeOffService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [employeesData, departmentsData, timeOffData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        timeOffService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setTimeOffRequests(timeOffData);
      
      // Create recent activities
      const activities = [
        ...timeOffData
          .filter(req => req.status === 'pending')
          .slice(0, 3)
          .map(req => {
            const employee = employeesData.find(emp => emp.Id === req.employeeId);
            return {
              id: `timeoff-${req.Id}`,
              type: 'time-off',
              message: `${employee?.firstName || 'Unknown'} ${employee?.lastName || 'Employee'} requested ${req.type} leave`,
              time: req.requestDate,
              status: req.status
            };
          }),
        ...employeesData
          .filter(emp => emp.status === 'active')
          .slice(0, 2)
          .map(emp => ({
            id: `employee-${emp.Id}`,
            type: 'employee',
            message: `${emp.firstName} ${emp.lastName} joined ${departments.find(d => d.Id === emp.departmentId)?.name || 'the company'}`,
            time: emp.startDate,
            status: 'active'
          }))
      ].slice(0, 5);
      
      setRecentActivities(activities.sort((a, b) => new Date(b.time) - new Date(a.time)));
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveTimeOff = async (request) => {
    try {
      await timeOffService.approve(request.Id, "HR Manager");
      toast.success("Time off request approved!");
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectTimeOff = async (request) => {
    try {
      await timeOffService.reject(request.Id);
      toast.success("Time off request rejected");
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const pendingRequests = timeOffRequests.filter(req => req.status === 'pending');
  const upcomingTimeOff = timeOffRequests.filter(req => 
    req.status === 'approved' && 
    new Date(req.startDate) >= new Date() &&
    new Date(req.startDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const getActivityIcon = (type) => {
    const icons = {
      'time-off': 'Calendar',
      'employee': 'UserPlus'
    };
    return icons[type] || 'Activity';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={activeEmployees.length}
          icon="Users"
          trend="up"
          trendValue="+2 this month"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          icon="Building2"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon="Clock"
          trend={pendingRequests.length > 3 ? "up" : "down"}
          trendValue={`${pendingRequests.length} waiting`}
        />
        <StatCard
          title="Upcoming Leave"
          value={upcomingTimeOff.length}
          icon="Calendar"
          trend="up"
          trendValue="Next 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Time Off Requests */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
              <Button variant="secondary" size="sm" leftIcon="Calendar">
                View All
              </Button>
            </div>

            {pendingRequests.length === 0 ? (
              <Empty
                icon="Calendar"
                title="No pending requests"
                message="All time off requests have been reviewed."
                showAction={false}
              />
            ) : (
              <div className="space-y-4">
                {pendingRequests.slice(0, 3).map((request) => {
                  const employee = employees.find(emp => emp.Id === request.employeeId);
                  return (
                    <TimeOffCard
                      key={request.Id}
                      request={request}
                      employee={employee}
                      onApprove={handleApproveTimeOff}
                      onReject={handleRejectTimeOff}
                      showActions={true}
                    />
                  );
                })}
                
                {pendingRequests.length > 3 && (
                  <div className="text-center pt-4">
                    <Button variant="secondary" size="sm">
                      View {pendingRequests.length - 3} more requests
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            {recentActivities.length === 0 ? (
              <Empty
                icon="Activity"
                title="No recent activity"
                message="Recent team activities will appear here."
                showAction={false}
              />
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" size="sm" leftIcon="UserPlus" className="w-full justify-start">
                Add New Employee
              </Button>
              <Button variant="secondary" size="sm" leftIcon="Calendar" className="w-full justify-start">
                Schedule Time Off
              </Button>
              <Button variant="secondary" size="sm" leftIcon="FileText" className="w-full justify-start">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;