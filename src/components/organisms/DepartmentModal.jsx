import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { departmentService } from '@/services/api/departmentService';
import { toast } from 'react-toastify';

const DepartmentModal = ({ isOpen, onClose, department, employees, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        headId: department.headId?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        headId: ''
      });
    }
    setErrors({});
  }, [department, isOpen]);

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
    
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
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
        headId: formData.headId ? parseInt(formData.headId) : null
      };

      let result;
      if (department) {
        result = await departmentService.update(department.Id, dataToSend);
        toast.success('Department updated successfully!');
      } else {
        result = await departmentService.create(dataToSend);
        toast.success('Department created successfully!');
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

  const employeeOptions = employees
    .filter(emp => emp.status === 'active')
    .map(emp => ({
      value: emp.Id.toString(),
      label: `${emp.firstName} ${emp.lastName}`
    }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {department ? 'Edit Department' : 'Add New Department'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
            />

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              required
            />

            <FormField
              label="Department Head"
              name="headId"
              type="select"
              value={formData.headId}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select department head (optional)' },
                ...employeeOptions
              ]}
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
                {department ? 'Update' : 'Create'} Department
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;