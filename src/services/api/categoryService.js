import categoriesMockData from "@/services/mockData/categories.json";

let categories = [...categoriesMockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(250);
    return [...categories].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(cat => cat.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(350);
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id)) + 1,
      ...categoryData,
      taskCount: 0,
      order: categories.length + 1
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(300);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories[index] = {
      ...categories[index],
      ...categoryData
    };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(250);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    return { ...deletedCategory };
  }
};