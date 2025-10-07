import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { aboutAPI } from '../services/api';
import { aboutSchema, categorySchema } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const About = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // let isLoading = false



  const { data: aboutData = [], isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await aboutAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error('Error fetching about:', error);
      toast.error('Failed to load about');
    }
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(aboutSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(categorySchema),
  });

  const createMutation = useMutation({
    mutationFn: aboutAPI.create,
    onSuccess: () => {
      toast.success('About created successfully!');
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(['about']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create about';
      toast.error(message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => aboutAPI.update(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      setIsEditModalOpen(false);
      setEditingCategory(null);
      resetEdit();
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
    }
  });

  // const deleteMutation = useMutation({
  //   mutationFn: aboutAPI.delete,
  //   onSuccess: () => {
  //     toast.success('Category deleted successfully!');
  //     queryClient.invalidateQueries(['about']);
  //   },
  //   onError: (error) => {
  //     const message = error.response?.data?.message || 'Failed to delete category';
  //     toast.error(message);
  //   }
  // });

  const handleCreateCategory = (data) => {
    createMutation.mutate(data);
  };

  const handleEditCategory = (data) => {
    updateMutation.mutate({ id: editingCategory._id, data });
  };

  // const handleDeleteCategory = (categoryId) => {
  //   if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated subcategories and items.')) {
  //     return;
  //   }
  //   deleteMutation.mutate(categoryId);
  // };

  // const openEditModal = (category) => {
  //   setEditingCategory(category);
  //   resetEdit({
  //     name: category.name,
  //     description: category.description || '',
  //   });
  //   setIsEditModalOpen(true);
  // };

  const filteredAboutData = aboutData.filter(about =>
    about.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    about.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log('aboutData',aboutData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Section</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage content about for organizing materials
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add About</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New About</DialogTitle>
              <DialogDescription>
                Add a new about to organize content
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate(handleCreateCategory)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-title"
                    placeholder="Enter title"
                    className="pl-10"
                    {...registerCreate('title')}
                  />
                </div>
                {errorsCreate.title && (
                  <p className="text-sm text-red-600">{errorsCreate.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  placeholder="Enter description"
                  rows={3}
                  {...registerCreate('description')}
                />
                {errorsCreate.description && (
                  <p className="text-sm text-red-600">{errorsCreate.description.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button type="submit" disabled={createMutation.isLoading} className="flex-1">
                  {createMutation.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createMutation.isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>About Section </CardTitle>
          <CardDescription>
            Manage content about and their descriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          
            <div className="space-y-4">
              {filteredAboutData.map((item,index)=>(

                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                      </h3>
                    
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                        </p>
                    
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(item.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
              ))}
             
            </div>
         
        </CardContent>
      </Card>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEditCategory)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  placeholder="Enter category name"
                  className="pl-10"
                  {...registerEdit('name')}
                />
              </div>
              {errorsEdit.name && (
                <p className="text-sm text-red-600">{errorsEdit.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter category description"
                rows={3}
                {...registerEdit('description')}
              />
              {errorsEdit.description && (
                <p className="text-sm text-red-600">{errorsEdit.description.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button type="submit" disabled={updateMutation.isLoading} className="flex-1">
                {updateMutation.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Update Category</span>
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={updateMutation.isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;

