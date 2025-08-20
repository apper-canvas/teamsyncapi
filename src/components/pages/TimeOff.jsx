import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import TimeOffCard from '@/components/molecules/TimeOffCard';
import TimeOffModal from '@/components/organisms/TimeOffModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { timeOffService } from '@/services/api/timeOffService';
import { employeeService } from '@/services/api/employeeService';
import { toast } from 'react-toastify';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const TimeOff = () => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [requestsData, employeesData] = await Promise.all([
        timeOffService.getAll(),
        employeeService.getAll()
      ]);
      setRequests(requestsData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message || "Failed to load time off data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveRequest = async (request) => {
    try {
      await timeOffService.approve(request.Id, "HR Manager");
      toast.success("Time off request approved!");
      loadData();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (request) => {
    if (window.confirm("Are you sure you want to reject this time off request?")) {
      try {
        await timeOffService.reject(request.Id);
        toast.success("Time off request rejected");
        loadData();
      } catch (error) {
        toast.error("Failed to reject request");
      }
    }
  };

  const handleModalSave = () => {
    loadData();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Get employee for a request
  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.Id === employeeId);
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const employee = getEmployee(request.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    
    const matchesSearch = 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesType = !typeFilter || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get calendar data for current month
  const getCalendarRequests = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return requests.filter(request => {
      const startDate = parseISO(request.startDate);
      const endDate = parseISO(request.endDate);
      
      return isWithinInterval(startDate, { start: monthStart, end: monthEnd }) ||
             isWithinInterval(endDate, { start: monthStart, end: monthEnd }) ||
             (startDate <= monthStart && endDate >= monthEnd);
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger"
    };
    return variants[status] || "default";
  };

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const calendarRequests = getCalendarRequests();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Off</h1>
          <p className="text-gray-600">Manage employee time off requests and approvals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            leftIcon={viewMode === "list" ? "Calendar" : "List"}
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
          >
            {viewMode === "list" ? "Calendar View" : "List View"}
          </Button>
          <Button leftIcon="Plus" onClick={() => setIsModalOpen(true)}>
            New Request
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(req => req.status === 'approved').length}
              </p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{calendarRequests.length}</p>
            </div>
            <ApperIcon name="Calendar" className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-600">{requests.length}</p>
            </div>
            <ApperIcon name="FileText" className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by employee or reason..."
                className="flex-1"
              />
              
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sm:w-40"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
              
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="sm:w-40"
              >
                <option value="">All Types</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
          </div>

          {/* Request Grid */}
          {filteredRequests.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No time off requests found"
              message={searchTerm || statusFilter || typeFilter ? 
                "Try adjusting your search or filter criteria." : 
                "Time off requests will appear here once submitted."
              }
              actionLabel={!searchTerm && !statusFilter && !typeFilter ? "Create Request" : undefined}
              onAction={!searchTerm && !statusFilter && !typeFilter ? () => setIsModalOpen(true) : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map(request => (
                <TimeOffCard
                  key={request.Id}
                  request={request}
                  employee={getEmployee(request.employeeId)}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                  showActions={request.status === 'pending'}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon="ChevronLeft"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon="ChevronRight"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              />
            </div>
          </div>

          {calendarRequests.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No requests this month"
              message="No time off requests scheduled for this month."
              showAction={false}
            />
          ) : (
            <div className="space-y-4">
              {calendarRequests.map(request => {
                const employee = getEmployee(request.employeeId);
                return (
                  <div key={request.Id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(request.startDate), 'MMM dd')} - {format(parseISO(request.endDate), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusBadge(request.status)}>
                        {request.status}
                      </Badge>
                      <span className="text-sm text-gray-500 capitalize">{request.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <TimeOffModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        employees={employees}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default TimeOff;