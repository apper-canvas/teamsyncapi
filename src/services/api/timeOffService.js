// Time Off Request Service with ApperClient Integration
const tableName = 'time_off_request_c';

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const timeOffService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform to maintain compatibility with existing UI
      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        type: request.type_c || 'vacation',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time off requests:", error?.response?.data?.message);
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const request = response.data;
      return {
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        type: request.type_c || 'vacation',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching time off request with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(requestData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: `${requestData.type} request`,
          employee_id_c: parseInt(requestData.employeeId),
          start_date_c: requestData.startDate,
          end_date_c: requestData.endDate,
          reason_c: requestData.reason,
          status_c: 'pending',
          type_c: requestData.type,
          approved_by_c: null,
          request_date_c: new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create time off request ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
            employeeId: result.employee_id_c?.Id || result.employee_id_c,
            startDate: result.start_date_c || '',
            endDate: result.end_date_c || '',
            reason: result.reason_c || '',
            status: result.status_c || 'pending',
            type: result.type_c || 'vacation',
            approvedBy: result.approved_by_c || null,
            requestDate: result.request_date_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating time off request:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, requestData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          employee_id_c: parseInt(requestData.employeeId),
          start_date_c: requestData.startDate,
          end_date_c: requestData.endDate,
          reason_c: requestData.reason,
          status_c: requestData.status || 'pending',
          type_c: requestData.type,
          approved_by_c: requestData.approvedBy || null
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
          console.error(`Failed to update time off request ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
            employeeId: result.employee_id_c?.Id || result.employee_id_c,
            startDate: result.start_date_c || '',
            endDate: result.end_date_c || '',
            reason: result.reason_c || '',
            status: result.status_c || 'pending',
            type: result.type_c || 'vacation',
            approvedBy: result.approved_by_c || null,
            requestDate: result.request_date_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating time off request:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async approve(id, approvedBy) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: 'approved',
          approved_by_c: approvedBy
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
          console.error(`Failed to approve time off request ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const result = successfulUpdates[0].data;
          return {
            Id: result.Id,
            employeeId: result.employee_id_c?.Id || result.employee_id_c,
            startDate: result.start_date_c || '',
            endDate: result.end_date_c || '',
            reason: result.reason_c || '',
            status: result.status_c || 'approved',
            type: result.type_c || 'vacation',
            approvedBy: result.approved_by_c || approvedBy,
            requestDate: result.request_date_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error approving time off request:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async reject(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: 'rejected'
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
          console.error(`Failed to reject time off request ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const result = successfulUpdates[0].data;
          return {
            Id: result.Id,
            employeeId: result.employee_id_c?.Id || result.employee_id_c,
            startDate: result.start_date_c || '',
            endDate: result.end_date_c || '',
            reason: result.reason_c || '',
            status: result.status_c || 'rejected',
            type: result.type_c || 'vacation',
            approvedBy: result.approved_by_c || null,
            requestDate: result.request_date_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error rejecting time off request:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getByEmployee(employeeId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        type: request.type_c || 'vacation',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time off requests by employee:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getPending() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["pending"]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c,
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        type: request.type_c || 'vacation',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pending time off requests:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
}
};