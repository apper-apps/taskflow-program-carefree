import tasksMockData from "@/services/mockData/tasks.json";

let tasks = [...tasksMockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      ...taskData,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async complete(id) {
    await delay(300);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = {
      ...tasks[index],
      completed: !tasks[index].completed,
      completedAt: !tasks[index].completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };
    return { ...tasks[index] };
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) {
      return [...tasks];
    }
    
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery)
    );
  }
};