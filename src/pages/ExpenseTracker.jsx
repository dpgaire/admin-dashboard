import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseAPI } from "@/services/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ExpenseTracker = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [selectedType, setSelectedType] = useState("expense");
  const [formData, setFormData] = useState({}); // Track form data

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await expenseAPI.getAll();
      return response.data;
    },
    onError: () => toast.error("Failed to load expenses"),
  });

  const createExpense = useMutation({
    mutationFn: expenseAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      toast.success("Expense added successfully");
      setIsFormOpen(false);
      setEditingExpense(null);
      setSelectedType("expense");
      setFormData({});
    },
    onError: () => toast.error("Failed to add expense"),
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }) => expenseAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      toast.success("Expense updated successfully");
      setIsFormOpen(false);
      setEditingExpense(null);
      setSelectedType("expense");
      setFormData({});
    },
    onError: () => toast.error("Failed to update expense"),
  });

  const deleteExpense = useMutation({
    mutationFn: expenseAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      toast.success("Expense deleted successfully");
    },
    onError: () => toast.error("Failed to delete expense"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    data.amount = parseFloat(data.amount);

    // Only include loanType if type is expense and selected
    if (data.type !== "expense") {
      delete data.loanType;
    }

    if (editingExpense) {
      updateExpense.mutate({ id: editingExpense.id, data });
    } else {
      createExpense.mutate(data);
    }
  };

  // Update form data when type or loanType changes
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setFormData((prev) => ({ ...prev, type: value }));
    if (value !== "expense") {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.loanType;
        return newData;
      });
    }
  };

  const handleLoanTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, loanType: value || "" }));
  };

  const confirmDeleteExpense = () => {
    if (deleteExpenseId) {
      deleteExpense.mutate(deleteExpenseId, {
        onSettled: () => setDeleteExpenseId(null),
      });
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.loanType &&
        expense.loanType.toLowerCase().includes(searchTerm.toLowerCase()))
  ).reverse();

  const totalIncome = filteredExpenses
    .filter((exp) => exp.type === "income")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpenses = filteredExpenses
    .filter((exp) => exp.type === "expense")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Initialize form data when editing
  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        description: editingExpense.description,
        amount: editingExpense.amount,
        type: editingExpense.type,
        category: editingExpense.category,
        date: editingExpense.date.split("T")[0],
        loanType: editingExpense.loanType || "",
      });
      setSelectedType(editingExpense.type);
    }
  }, [editingExpense]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your income, expenses, and loans.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExpense(null)}>
              <Plus className="mr-2" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Transaction" : "Add New Transaction"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="description">Description</label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Type</label>
                <Select
                  value={formData.type || "expense"}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FIXED Loan Type Field */}
              {(selectedType === "expense" || editingExpense?.type === "expense") && (
                <div>
                  <label htmlFor="loanType">Loan Type</label>
                  <Select
                    value={formData.loanType || undefined}
                    onValueChange={handleLoanTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select loan type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="car">Car Loan</SelectItem>
                      <SelectItem value="education">Education Loan</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label htmlFor="category">Category</label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={createExpense.isPending || updateExpense.isPending}
              >
                {editingExpense ? "Update Transaction" : "Add Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rest of your component remains exactly the same */}
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
            <CardTitle className="text-green-700 dark:text-green-300">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-800 dark:text-green-200">
            Rs {totalIncome.toFixed(2)}
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-300">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-800 dark:text-red-200">
            -Rs {totalExpenses.toFixed(2)}
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Rs {netBalance.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.description}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      {expense.loanType ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          {expense.loanType.replace("-", " ")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        expense.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {expense.type === "income" ? "+" : "-"}Rs {expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingExpense(expense);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteExpenseId(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <AlertDialog
        open={!!deleteExpenseId}
        onOpenChange={() => setDeleteExpenseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteExpense}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseTracker;