import departmentsData from '@/services/mockData/departments.json';

let departments = [...departmentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const departmentService = {
  async getAll() {
    await delay();
    return [...departments];
  },

  async getById(id) {
    await delay();
    const department = departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay();
    const maxId = Math.max(...departments.map(dept => dept.Id), 0);
    const newDepartment = {
      Id: maxId + 1,
      ...departmentData,
      memberCount: 0
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay();
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departments[index] = { ...departments[index], ...departmentData };
    return { ...departments[index] };
  },

  async delete(id) {
    await delay();
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departments.splice(index, 1);
    return true;
  }
};