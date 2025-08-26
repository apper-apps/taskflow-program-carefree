export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "order_c" } }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        color: category.color_c || '#5B4FCF',
        icon: category.icon_c || 'Folder',
        taskCount: category.task_count_c || 0,
        order: category.order_c || 1
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "order_c" } }
        ]
      };

      const response = await apperClient.getRecordById('category_c', id, params);

      if (!response || !response.data) {
        throw new Error("Category not found");
      }

      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name,
        color: category.color_c || '#5B4FCF',
        icon: category.icon_c || 'Folder',
        taskCount: category.task_count_c || 0,
        order: category.order_c || 1
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error);
      }
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: categoryData.name || 'Untitled Category',
          color_c: categoryData.color || '#5B4FCF',
          icon_c: categoryData.icon || 'Folder',
          task_count_c: 0,
          order_c: categoryData.order || 1
        }]
      };

      const response = await apperClient.createRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} category records:${JSON.stringify(failedRecords)}`);
        }

        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            Id: category.Id,
            name: category.Name,
            color: category.color_c || '#5B4FCF',
            icon: category.icon_c || 'Folder',
            taskCount: category.task_count_c || 0,
            order: category.order_c || 1
          };
        }
      }

      throw new Error('Failed to create category');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error);
      }
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      if (categoryData.name !== undefined) updateData.Name = categoryData.name;
      if (categoryData.color !== undefined) updateData.color_c = categoryData.color;
      if (categoryData.icon !== undefined) updateData.icon_c = categoryData.icon;
      if (categoryData.taskCount !== undefined) updateData.task_count_c = categoryData.taskCount;
      if (categoryData.order !== undefined) updateData.order_c = categoryData.order;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} category records:${JSON.stringify(failedUpdates)}`);
        }

        if (successfulUpdates.length > 0) {
          const category = successfulUpdates[0].data;
          return {
            Id: category.Id,
            name: category.Name,
            color: category.color_c || '#5B4FCF',
            icon: category.icon_c || 'Folder',
            taskCount: category.task_count_c || 0,
            order: category.order_c || 1
          };
        }
      }

      throw new Error('Failed to update category');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} category records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error);
      }
      throw error;
    }
}
};