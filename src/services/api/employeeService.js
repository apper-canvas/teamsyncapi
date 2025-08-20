import employeesData from '@/services/mockData/employees.json';

// Ensure all employees have emergency contact structure
let employees = employeesData.map(employee => ({
  ...employee,
  emergencyContact: employee.emergencyContact || {
    name: '',
    phone: '',
    relationship: ''
  }
}));

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const employeeService = {
  async getAll() {
    await delay();
    return [...employees];
  },

  async getById(id) {
    await delay();
    const employee = employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  },

  async create(employeeData) {
    await delay();
    const maxId = Math.max(...employees.map(emp => emp.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData,
      status: "active"
    };
    employees.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, employeeData) {
    await delay();
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    employees[index] = { ...employees[index], ...employeeData };
    return { ...employees[index] };
  },

  async delete(id) {
    await delay();
    const index = employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    employees[index].status = "archived";
    return { ...employees[index] };
  },

  async getByDepartment(departmentId) {
    await delay();
    return employees.filter(emp => emp.departmentId === parseInt(departmentId) && emp.status === "active");
  }
};