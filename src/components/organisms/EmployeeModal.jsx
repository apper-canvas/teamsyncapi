import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { toast } from 'react-toastify';

const EmployeeModal = ({ isOpen, onClose, employee, departments, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    departmentId: '',
    startDate: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        departmentId: employee.departmentId?.toString() || '',
        startDate: employee.startDate || '',
        photoUrl: employee.photoUrl || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        departmentId: '',
        startDate: '',
        photoUrl: ''
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        departmentId: parseInt(formData.departmentId)
      };

      let result;
      if (employee) {
        result = await employeeService.update(employee.Id, dataToSend);
        toast.success('Employee updated successfully!');
      } else {
        result = await employeeService.create(dataToSend);
        toast.success('Employee created successfully!');
      }
      
      onSave(result);
      onClose();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const departmentOptions = departments.map(dept => ({
    value: dept.Id.toString(),
    label: dept.name
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              required
            />

            <FormField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
              required
            />

            <FormField
              label="Department"
              name="departmentId"
              type="select"
              value={formData.departmentId}
              onChange={handleInputChange}
              options={[{ value: '', label: 'Select a department' }, ...departmentOptions]}
              error={errors.departmentId}
              required
            />

            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
              required
            />

            <FormField
              label="Photo URL"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/photo.jpg"
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
              >
                {employee ? 'Update' : 'Create'} Employee
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;