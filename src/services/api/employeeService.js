// Employee service for data operations
// Employee Service with ApperClient Integration
const tableName = 'employee_c';

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const employeeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform to maintain compatibility with existing UI
      return response.data.map(employee => ({
        Id: employee.Id,
        firstName: employee.first_name_c || '',
        lastName: employee.last_name_c || '',
        email: employee.email_c || '',
        phone: employee.phone_c || '',
        role: employee.role_c || '',
        departmentId: employee.department_id_c?.Id || employee.department_id_c,
        startDate: employee.start_date_c || '',
        status: employee.status_c || 'active',
        photoUrl: employee.photo_url_c || '',
        emergencyContact: {
          name: employee.emergency_contact_name_c || '',
          phone: employee.emergency_contact_phone_c || '',
          relationship: employee.emergency_contact_relationship_c || ''
        }
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const employee = response.data;
      return {
        Id: employee.Id,
        firstName: employee.first_name_c || '',
        lastName: employee.last_name_c || '',
        email: employee.email_c || '',
        phone: employee.phone_c || '',
        role: employee.role_c || '',
        departmentId: employee.department_id_c?.Id || employee.department_id_c,
        startDate: employee.start_date_c || '',
        status: employee.status_c || 'active',
        photoUrl: employee.photo_url_c || '',
        emergencyContact: {
          name: employee.emergency_contact_name_c || '',
          phone: employee.emergency_contact_phone_c || '',
          relationship: employee.emergency_contact_relationship_c || ''
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(employeeData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone,
          role_c: employeeData.role,
          start_date_c: employeeData.startDate,
          status_c: 'active',
          photo_url_c: employeeData.photoUrl || '',
          department_id_c: parseInt(employeeData.departmentId),
          emergency_contact_name_c: employeeData.emergencyContact?.name || '',
          emergency_contact_phone_c: employeeData.emergencyContact?.phone || '',
          emergency_contact_relationship_c: employeeData.emergencyContact?.relationship || ''
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create employee ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          const result = successfulRecords[0].data;
          return {
            Id: result.Id,
            firstName: result.first_name_c || '',
            lastName: result.last_name_c || '',
            email: result.email_c || '',
            phone: result.phone_c || '',
            role: result.role_c || '',
            departmentId: result.department_id_c?.Id || result.department_id_c,
            startDate: result.start_date_c || '',
            status: result.status_c || 'active',
            photoUrl: result.photo_url_c || '',
            emergencyContact: {
              name: result.emergency_contact_name_c || '',
              phone: result.emergency_contact_phone_c || '',
              relationship: result.emergency_contact_relationship_c || ''
            }
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, employeeData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone,
          role_c: employeeData.role,
          start_date_c: employeeData.startDate,
          status_c: employeeData.status || 'active',
          photo_url_c: employeeData.photoUrl || '',
          department_id_c: parseInt(employeeData.departmentId),
          emergency_contact_name_c: employeeData.emergencyContact?.name || '',
          emergency_contact_phone_c: employeeData.emergencyContact?.phone || '',
          emergency_contact_relationship_c: employeeData.emergencyContact?.relationship || ''
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update employee ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          const result = successfulUpdates[0].data;
          return {
            Id: result.Id,
            firstName: result.first_name_c || '',
            lastName: result.last_name_c || '',
            email: result.email_c || '',
            phone: result.phone_c || '',
            role: result.role_c || '',
            departmentId: result.department_id_c?.Id || result.department_id_c,
            startDate: result.start_date_c || '',
            status: result.status_c || 'active',
            photoUrl: result.photo_url_c || '',
            emergencyContact: {
              name: result.emergency_contact_name_c || '',
              phone: result.emergency_contact_phone_c || '',
              relationship: result.emergency_contact_relationship_c || ''
            }
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      // Archive by updating status to archived instead of deleting
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: 'archived'
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to archive employee ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error archiving employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getByDepartment(departmentId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "photo_url_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } }
        ],
        where: [
          {
            FieldName: "department_id_c",
            Operator: "EqualTo",
            Values: [parseInt(departmentId)]
          },
          {
            FieldName: "status_c", 
            Operator: "EqualTo",
            Values: ["active"]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(employee => ({
        Id: employee.Id,
        firstName: employee.first_name_c || '',
        lastName: employee.last_name_c || '',
        email: employee.email_c || '',
        phone: employee.phone_c || '',
        role: employee.role_c || '',
        departmentId: employee.department_id_c?.Id || employee.department_id_c,
        startDate: employee.start_date_c || '',
        status: employee.status_c || 'active',
        photoUrl: employee.photo_url_c || '',
        emergencyContact: {
          name: employee.emergency_contact_name_c || '',
          phone: employee.emergency_contact_phone_c || '',
          relationship: employee.emergency_contact_relationship_c || ''
        }
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
console.error("Error fetching employees by department:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
};