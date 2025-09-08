import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { peopleService } from "@/services/api/peopleService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import { parseDueDateFromText } from "@/utils/dateUtils";

const TaskModal = ({ isOpen, onClose, onSave, task, categories }) => {
const [formData, setFormData] = useState({
    title: "",
categoryId: "",
    completed: false,
    priority: "medium",
    dueDate: ""
  });
  
  const [attachments, setAttachments] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
completed: task.completed || false,
        categoryId: task.categoryId || (categories.length > 0 ? categories[0].Id : ""),
        priority: task.priority || "medium",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      });
      // Load attachments for existing task
      loadAttachments();
    } else {
      setFormData({
completed: false,
        description: "",
        categoryId: categories.length > 0 ? categories[0].Id : "",
        priority: "medium",
        dueDate: ""
      });
      setAttachments([]);
    }
    setErrors({});
    setUploadError("");
  }, [task, categories, isOpen]);

  const loadAttachments = async () => {
    if (task?.Id) {
      try {
        const { attachmentService } = await import('@/services/api/attachmentService');
        const taskAttachments = await attachmentService.getByTaskId(task.Id);
        setAttachments(taskAttachments);
      } catch (error) {
        console.error("Error loading attachments:", error);
      }
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

const taskData = {
      ...formData,
categoryId: formData.categoryId || null,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    onSave(taskData);
    onClose();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !task?.Id) return;

    setUploadingFiles(files.map(file => ({ name: file.name, progress: 0 })));
    setUploadError("");

    try {
      const { attachmentService } = await import('@/services/api/attachmentService');
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate file upload (in real app, you'd upload to cloud storage first)
        const attachmentData = {
          name: file.name,
          filePathUrl: `uploads/${file.name}`, // This would be the actual uploaded file URL
          fileSize: file.size,
          taskId: task.Id
        };

        // Update progress
        setUploadingFiles(prev => 
          prev.map((f, idx) => idx === i ? { ...f, progress: 50 } : f)
        );

        const newAttachment = await attachmentService.create(attachmentData);
        
        // Update progress to complete
        setUploadingFiles(prev => 
          prev.map((f, idx) => idx === i ? { ...f, progress: 100 } : f)
        );

        setAttachments(prev => [...prev, newAttachment]);
      }

      // Clear uploading state
      setTimeout(() => {
        setUploadingFiles([]);
      }, 1000);

    } catch (error) {
      setUploadError("Failed to upload files. Please try again.");
      setUploadingFiles([]);
      console.error("Error uploading files:", error);
    }

    // Clear file input
    e.target.value = '';
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;

    try {
      const { attachmentService } = await import('@/services/api/attachmentService');
      await attachmentService.delete(attachmentId);
      setAttachments(prev => prev.filter(att => att.Id !== attachmentId));
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
    
    // Smart parsing for due dates
    const parsedDate = parseDueDateFromText(title);
    if (parsedDate && !formData.dueDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: parsedDate.toISOString().split("T")[0]
      }));
    }
    
    // Clear title error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {task ? "Edit Task" : "New Task"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Review presentation by tomorrow"
                className={errors.title ? "border-red-300 focus:ring-red-500" : ""}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more details about this task..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
</div>
          </div>

          {/* Due Date and Assigned To Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <Select
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value || null }))}
              >
                <option value="">Unassigned</option>
                {/* Add people options dynamically */}
              </Select>
            </div>
          </div>

          {/* Completed Checkbox (only for existing tasks) */}
          {task && (
            <div className="flex items-center">
              <input
                id="completed"
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                Mark as completed
              </label>
            </div>
          )}

          {/* Attachments Section */}
          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              
              <div className="border border-gray-200 rounded-lg p-3">
                {/* File Upload */}
                <div className="mb-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {uploadError && (
                    <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>

                {/* Uploading Progress */}
                {uploadingFiles.map((file, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate">{file.name}</span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Attachment List */}
                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Paperclip" className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAttachment(attachment.Id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No attachments yet
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  </AnimatePresence>
);
};

export default TaskModal;