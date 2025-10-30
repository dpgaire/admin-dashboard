import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExpenseTracker = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseAPI.getAll();
      return response.data;
    },
    onError: () => toast.error('Failed to load expenses'),
  });

  const createExpense = useMutation({
    mutationFn: expenseAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Expense added successfully');
      setIsFormOpen(false);
      setEditingExpense(null);
    },
    onError: () => toast.error('Failed to add expense'),
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }) => expenseAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Expense updated successfully');
      setIsFormOpen(false);
      setEditingExpense(null);
    },
    onError: () => toast.error('Failed to update expense'),
  });

  const deleteExpense = useMutation({
    mutationFn: expenseAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Expense deleted successfully');
    },
    onError: () => toast.error('Failed to delete expense'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.amount = parseFloat(data.amount);

    if (editingExpense) {
      updateExpense.mutate({ id: editingExpense.id, data });
    } else {
      createExpense.mutate(data);
    }
  };

  const confirmDeleteExpense = () => {
    if (deleteExpenseId) {
      deleteExpense.mutate(deleteExpenseId, {
        onSettled: () => setDeleteExpenseId(null),
      });
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = filteredExpenses
    .filter(exp => exp.type === 'income')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpenses = filteredExpenses
    .filter(exp => exp.type === 'expense')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your income and expenses.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExpense(null)}><Plus className="mr-2" /> Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="description">Description</label>
                <Input 
                  id="description" 
                  name="description" 
                  defaultValue={editingExpense?.description || ''} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  defaultValue={editingExpense?.amount || ''} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="type">Type</label>
                <Select name="type" defaultValue={editingExpense?.type || 'expense'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <Input 
                  id="category" 
                  name="category" 
                  defaultValue={editingExpense?.category || ''} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  defaultValue={editingExpense?.date ? editingExpense.date.split('T')[0] : new Date().toISOString().split('T')[0]} 
                  required 
                />
              </div>
              <Button type="submit" disabled={createExpense.isLoading || updateExpense.isLoading}>
                {editingExpense ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Total Income</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-800 dark:text-green-200">
            ${totalIncome.toFixed(2)}
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-300">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-800 dark:text-red-200">
            -${totalExpenses.toFixed(2)}
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Net Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            ${netBalance.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          filteredExpenses.map(expense => (
            <Card key={expense.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-gray-500">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                </p>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingExpense(expense);
                  setIsFormOpen(true);
                }}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteExpenseId(expense.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteExpenseId} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpense} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseTracker;
