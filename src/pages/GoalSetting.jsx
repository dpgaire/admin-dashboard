import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalAPI } from '@/services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import LoadingSpinner from '@/components/LoadingSpinner';

const GoalSetting = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [newObjective, setNewObjective] = useState({ title: '', description: '', targetDate: '' });
  const [newKeyResult, setNewKeyResult] = useState({ title: '', targetValue: 100, currentValue: 0 });
  const [selectedObjective, setSelectedObjective] = useState(null);

  const { data: objectives = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await goalAPI.getAll();
      return response.data;
    },
    onError: () => toast.error('Failed to load goals'),
  });

  const createObjective = useMutation({
    mutationFn: goalAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      toast.success('Objective created successfully');
      setNewObjective({ title: '', description: '', targetDate: '' });
    },
    onError: () => toast.error('Failed to create objective'),
  });

  const deleteObjective = useMutation({
    mutationFn: goalAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      toast.success('Objective deleted successfully');
    },
    onError: () => toast.error('Failed to delete objective'),
  });

  const createKeyResult = useMutation({
    mutationFn: ({ goalId, data }) => goalAPI.createKeyResult(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      toast.success('Key result created successfully');
      setNewKeyResult({ title: '', targetValue: 100, currentValue: 0 });
      setSelectedObjective(null);
    },
    onError: () => toast.error('Failed to create key result'),
  });

  const updateKeyResult = useMutation({
    mutationFn: ({ goalId, krId, data }) => goalAPI.updateKeyResult(goalId, krId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
    },
    onError: () => toast.error('Failed to update key result'),
  });

  const deleteKeyResult = useMutation({
    mutationFn: ({ goalId, krId }) => goalAPI.deleteKeyResult(goalId, krId),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      toast.success('Key result deleted successfully');
    },
    onError: () => toast.error('Failed to delete key result'),
  });

  const handleAddObjective = () => {
    if (newObjective.title) {
      createObjective.mutate(newObjective);
    }
  };

  const handleAddKeyResult = (objectiveId) => {
    if (newKeyResult.title) {
      createKeyResult.mutate({ goalId: objectiveId, data: newKeyResult });
    }
  };

  const handleUpdateKeyResult = (objectiveId, keyResultId, updatedKr) => {
    updateKeyResult.mutate({ goalId: objectiveId, krId: keyResultId, data: updatedKr });
  };

  const filteredObjectives = objectives.filter(obj =>
    obj.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goal Setting (OKRs)</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" /> Add Objective</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Objective</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                placeholder="Objective Title" 
                value={newObjective.title} 
                onChange={e => setNewObjective({ ...newObjective, title: e.target.value })} 
              />
              <Textarea 
                placeholder="Description (supports Markdown)" 
                value={newObjective.description} 
                onChange={e => setNewObjective({ ...newObjective, description: e.target.value })} 
              />
              <Input 
                type="date" 
                value={newObjective.targetDate} 
                onChange={e => setNewObjective({ ...newObjective, targetDate: e.target.value })} 
              />
              <Button onClick={handleAddObjective} disabled={createObjective.isLoading}>
                {createObjective.isLoading ? 'Adding...' : 'Add Objective'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search objectives..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredObjectives.map(obj => (
          <Card key={obj.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {obj.title}
                <Button variant="ghost" size="sm" onClick={() => deleteObjective.mutate(obj.id)}><Trash2 className="h-4 w-4" /></Button>
              </CardTitle>
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-500 dark:text-gray-400">
                <ReactMarkdown>{obj.description}</ReactMarkdown>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Target: {obj.targetDate}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {obj.keyResults.map(kr => (
                <div key={kr.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{kr.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => deleteKeyResult.mutate({ goalId: obj.id, krId: kr.id })}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={kr.currentValue} 
                      onChange={e => handleUpdateKeyResult(obj.id, kr.id, { currentValue: parseInt(e.target.value) })} 
                      className="w-20 h-8"
                    />
                    <Progress value={(kr.currentValue / kr.targetValue) * 100} />
                    <span className="text-xs text-gray-500">{kr.targetValue}</span>
                  </div>
                </div>
              ))}
              <Dialog open={selectedObjective === obj.id} onOpenChange={() => setSelectedObjective(null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedObjective(obj.id)}><Plus className="mr-2 h-4 w-4" /> Add Key Result</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Key Result for "{obj.title}"</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Key Result Title" 
                      value={newKeyResult.title} 
                      onChange={e => setNewKeyResult({ ...newKeyResult, title: e.target.value })} 
                    />
                    <Input 
                      type="number" 
                      placeholder="Target Value" 
                      value={newKeyResult.targetValue} 
                      onChange={e => setNewKeyResult({ ...newKeyResult, targetValue: parseInt(e.target.value) })} 
                    />
                    <Button onClick={() => handleAddKeyResult(obj.id)} disabled={createKeyResult.isLoading}>
                      {createKeyResult.isLoading ? 'Adding...' : 'Add Key Result'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSetting;
