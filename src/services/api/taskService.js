export const taskService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { 
            field: { Name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { 
            field: { Name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);

      if (!response || !response.data) {
        throw new Error("Task not found");
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error);
      }
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: taskData.title || 'Untitled Task',
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          priority_c: taskData.priority || 'medium',
          due_date_c: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : null,
          completed_c: false,
          completed_at_c: null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || '',
            description: task.description_c || '',
            categoryId: task.category_id_c,
            priority: task.priority_c || 'medium',
            dueDate: task.due_date_c,
            completed: task.completed_c || false,
            completedAt: task.completed_at_c,
            createdAt: task.created_at_c,
            updatedAt: task.updated_at_c
          };
        }
      }

      throw new Error('Failed to create task');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error);
      }
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString()
      };

      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) {
        updateData.due_date_c = taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : null;
      }
      if (taskData.categoryId !== undefined) updateData.category_id_c = taskData.categoryId ? parseInt(taskData.categoryId) : null;
      if (taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed;
        updateData.completed_at_c = taskData.completed ? new Date().toISOString() : null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
        }

        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            title: task.title_c || '',
            description: task.description_c || '',
            categoryId: task.category_id_c,
            priority: task.priority_c || 'medium',
            dueDate: task.due_date_c,
            completed: task.completed_c || false,
            completedAt: task.completed_at_c,
            createdAt: task.created_at_c,
            updatedAt: task.updated_at_c
          };
        }
      }

      throw new Error('Failed to update task');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error);
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

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error);
      }
      throw error;
    }
  },

  async complete(id) {
    const task = await this.getById(id);
    const updatedTask = await this.update(id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
    return updatedTask;
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { 
            field: { Name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [{
              fieldName: "title_c",
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          }, {
            conditions: [{
              fieldName: "description_c", 
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          }]
        }]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error searching tasks:", error);
      }
      return [];
    }
  }
};