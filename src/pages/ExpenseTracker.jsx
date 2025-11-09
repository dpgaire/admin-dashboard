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
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";
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
  const [formData, setFormData] = useState({});

  // Global toggle for summary cards
  const [showSummaryAmounts, setShowSummaryAmounts] = useState(false);

  // Per-transaction toggle state
  const [visibleAmounts, setVisibleAmounts] = useState({}); // { [id]: true/false }

  const toggleAmountVisibility = (id) => {
    setVisibleAmounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
      // set FormData({});
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

    if (data.type !== "expense") {
      delete data.loanType;
    }

    if (editingExpense) {
      updateExpense.mutate({ id: editingExpense.id, data });
    } else {
      createExpense.mutate(data);
    }
  };

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

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.loanType &&
          expense.loanType.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .reverse();

  const totalIncome = filteredExpenses
    .filter((exp) => exp.type === "income")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpenses = filteredExpenses
    .filter((exp) => exp.type === "expense")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netBalance = totalIncome - totalExpenses;

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

  // Masked amount component
  const MaskedAmount = ({ amount, show, prefix = "", suffix = "" }) => {
    const masked = "XXXX";
    const formatted = `${prefix}Rs ${amount.toFixed(2)}${suffix}`;
    return (
      <span className="font-mono text-lg">
        {show ? formatted : masked}
      </span>
    );
  };

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
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Type</label>
                <Select value={formData.type || "expense"} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedType === "expense" || editingExpense?.type === "expense") && (
                <div>
                  <label htmlFor="loanType">Loan Type</label>
                  <Select
                    value={formData.loanType || undefined}
                    onValueChange={handleLoanTypeChange}
                  >
                    <SelectTrigger>
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
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
              <Button type="submit" disabled={createExpense.isPending || updateExpense.isPending}>
                {editingExpense ? "Update" : "Add"} Transaction
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

      {/* Summary Cards with Global Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-green-700 dark:text-green-300">Total Income</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSummaryAmounts(!showSummaryAmounts)}
              className="h-8 w-8"
            >
              {showSummaryAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-800 dark:text-green-200">
            <MaskedAmount amount={totalIncome} show={showSummaryAmounts} prefix="" />
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-red-700 dark:text-red-300">Total Expenses</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSummaryAmounts(!showSummaryAmounts)}
              className="h-8 w-8"
            >
              {showSummaryAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-800 dark:text-red-200">
            -<MaskedAmount amount={totalExpenses} show={showSummaryAmounts} />
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-700 dark:text-blue-300">Net Balance</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSummaryAmounts(!showSummaryAmounts)}
              className="h-8 w-8"
            >
              {showSummaryAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            <MaskedAmount amount={netBalance} show={showSummaryAmounts} prefix="" />
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
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
                {filteredExpenses.map((expense) => {
                  const isVisible = visibleAmounts[expense.id];
                  const displayAmount = isVisible
                    ? expense.amount.toFixed(2)
                    : "XXXX";

                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
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
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`font-semibold font-mono ${
                              expense.type === "income"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {expense.type === "income" ? "+" : "-"}Rs {displayAmount}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toggleAmountVisibility(expense.id)}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
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
                  );
                })}
              </TableBody>
            </Table>
          </Card>
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
            <AlertDialogAction onClick={confirmDeleteExpense} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseTracker;