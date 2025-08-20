import timeOffData from '@/services/mockData/timeOffRequests.json';

let timeOffRequests = [...timeOffData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const timeOffService = {
  async getAll() {
    await delay();
    return [...timeOffRequests];
  },

  async getById(id) {
    await delay();
    const request = timeOffRequests.find(req => req.Id === parseInt(id));
    if (!request) {
      throw new Error("Time off request not found");
    }
    return { ...request };
  },

  async create(requestData) {
    await delay();
    const maxId = Math.max(...timeOffRequests.map(req => req.Id), 0);
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      status: "pending",
      approvedBy: null,
      requestDate: new Date().toISOString().split('T')[0]
    };
    timeOffRequests.push(newRequest);
    return { ...newRequest };
  },

  async update(id, requestData) {
    await delay();
    const index = timeOffRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    timeOffRequests[index] = { ...timeOffRequests[index], ...requestData };
    return { ...timeOffRequests[index] };
  },

  async approve(id, approvedBy) {
    await delay();
    const index = timeOffRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    timeOffRequests[index].status = "approved";
    timeOffRequests[index].approvedBy = approvedBy;
    return { ...timeOffRequests[index] };
  },

  async reject(id) {
    await delay();
    const index = timeOffRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Time off request not found");
    }
    timeOffRequests[index].status = "rejected";
    return { ...timeOffRequests[index] };
  },

  async getByEmployee(employeeId) {
    await delay();
    return timeOffRequests.filter(req => req.employeeId === parseInt(employeeId));
  },

  async getPending() {
    await delay();
    return timeOffRequests.filter(req => req.status === "pending");
  }
};