export const attachmentService = {
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
          { field: { Name: "name_c" } },
          { field: { Name: "file_path_url_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "upload_date_c" } },
          { 
            field: { Name: "task_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('attachment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(attachment => ({
        Id: attachment.Id,
        name: attachment.name_c || attachment.Name || '',
        filePathUrl: attachment.file_path_url_c || '',
        fileSize: attachment.file_size_c || 0,
        uploadDate: attachment.upload_date_c,
        taskId: attachment.task_id_c?.Id || attachment.task_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attachments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attachments:", error);
      }
      return [];
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "file_path_url_c" } },
          { field: { Name: "file_size_c" } },
          { field: { Name: "upload_date_c" } },
          { 
            field: { Name: "task_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('attachment_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(attachment => ({
        Id: attachment.Id,
        name: attachment.name_c || attachment.Name || '',
        filePathUrl: attachment.file_path_url_c || '',
        fileSize: attachment.file_size_c || 0,
        uploadDate: attachment.upload_date_c,
        taskId: attachment.task_id_c?.Id || attachment.task_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attachments for task ${taskId}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching attachments for task ${taskId}:`, error);
      }
      return [];
    }
  },

  async create(attachmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: attachmentData.name || 'Untitled Attachment',
          name_c: attachmentData.name || '',
          file_path_url_c: attachmentData.filePathUrl || '',
          file_size_c: attachmentData.fileSize || 0,
          upload_date_c: new Date().toISOString(),
          task_id_c: attachmentData.taskId ? parseInt(attachmentData.taskId) : null
        }]
      };

      const response = await apperClient.createRecord('attachment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attachment records:${JSON.stringify(failedRecords)}`);
        }

        if (successfulRecords.length > 0) {
          const attachment = successfulRecords[0].data;
          return {
            Id: attachment.Id,
            name: attachment.name_c || attachment.Name || '',
            filePathUrl: attachment.file_path_url_c || '',
            fileSize: attachment.file_size_c || 0,
            uploadDate: attachment.upload_date_c,
            taskId: attachment.task_id_c
          };
        }
      }

      throw new Error('Failed to create attachment');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attachment:", error?.response?.data?.message);
      } else {
        console.error("Error creating attachment:", error);
      }
      throw error;
    }
  },

  async delete(attachmentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(attachmentId)]
      };

      const response = await apperClient.deleteRecord('attachment_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} attachment records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attachment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting attachment:", error);
      }
      throw error;
    }
  }
};