import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2Icon } from "lucide-react";
import { createDepenses, updateDepenses } from "../services/api";
import { Bounce, toast } from "react-toastify";
import BankWithdrawals from "./BankWithdrawals";
import axios from "axios";
import ConfirmationDialog from "../components/ConfirmationDialog";

interface Expense {
  id: number;
  date: string;
  libele: string;
  montant: number;
  created_at: string;
}

const initialData: Expense[] = [
  {
    id: 1,
    date: "2024-03-15",
    libele: "Fournitures de bureau",
    montant: 250.0,
    created_at: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    date: "2024-03-14",
    libele: "Maintenance équipement",
    montant: 500.0,
    created_at: "2024-03-14T15:45:00Z",
  },
  {
    id: 3,
    date: "2024-03-13",
    libele: "Facture électricité",
    montant: 350.0,
    created_at: "2024-03-13T09:20:00Z",
  },
];

interface ExpenseFormData {
  id: number;
  date: string;
  libele: string;
  montant: number;
}

function Expenses() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBankWithdrawal, setSelectedBankWithdrawal] =
    useState<Expense | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
  const columns: ColumnDef<Expense>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: "Libellé",
      accessorKey: "libele",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.libele}
        </span>
      ),
    },
    {
      header: "Montant",
      accessorKey: "montant",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.montant.toLocaleString()} MAD
        </span>
      ),
    },
    {
      header: "Créé à",
      accessorKey: "created_at",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => row.original.onEdit?.(row.original)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBranchToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://167.114.0.177:81/depenses/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setExpenses(result); // Store fetched data in state
      } catch (err) {
        // setError(err.message); // Handle errors
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense: Expense = {
      ...formData,
      // id: Date.now(),
      created_at: new Date().toISOString(),
    };
    // setExpenses([newExpense, ...expenses]);
  };

  const handleEditWithdrawal = (formData: ExpenseFormData) => {
    if (!selectedBankWithdrawal) return;

    const updatedBW = expenses.map((bw) =>
      bw.id === selectedBankWithdrawal.id ? { ...bw, ...formData } : bw
    );
    setExpenses(updatedBW);
  };

  const handleViewBranch = (branch: ExpenseFormData) => {
    setSelectedBankWithdrawal(branch);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (d: Expense) => {
    setSelectedBankWithdrawal(d);
    setIsEditModalOpen(true);
  };

  const branchesWithActions = expenses.map((w) => ({
    ...w,
    onView: handleEditWithdrawal,
    onEdit: handleEditClick,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.montant,
    0
  );

  function ExpenseForm({
    onSubmit,
    onClose,
    initialData,
  }: {
    onSubmit: (data: ExpenseFormData) => void;
    onClose: () => void;
    initialData?: Expense;
  }) {
    const [formData, setFormData] = useState<ExpenseFormData>({
      date: initialData?.date || new Date().toISOString().split("T")[0],
      libele: initialData?.libele || "",
      montant: initialData?.montant || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const createdData = !initialData
        ? await createDepenses(formData)
        : await updateDepenses(formData, initialData?.id);
      setExpenses([...expenses, createdData]);

      onSubmit(formData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Libellé
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.libele}
            onChange={(e) =>
              setFormData({ ...formData, libele: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Montant
          </label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.montant || ""}
            onChange={(e) =>
              setFormData({ ...formData, montant: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dépenses</h1>
          <p className="text-sm text-gray-500">
            Total des dépenses: {totalAmount.toLocaleString()} MAD
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Dépense</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={branchesWithActions}
          searchPlaceholder="Rechercher des dépenses..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Dépense"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBankWithdrawal(null);
        }}
        title="Edit BankWithdrawal"
      >
        {selectedBankWithdrawal && (
          <ExpenseForm
            onSubmit={handleEditWithdrawal}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedBankWithdrawal(null);
            }}
            initialData={selectedBankWithdrawal}
          />
        )}
      </Modal>
      <ConfirmationDialog
        isOpen={branchToDelete !== null}
        onConfirm={async () => {
          try {
            await axios.delete(
              `http://167.114.0.177:81/depenses/${branchToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted branch
            setExpenses(
              expenses.filter((branch) => branch.id !== branchToDelete)
            );
            setBranchToDelete(null);
            // Show success message
            // alert("Branch deleted successfully");
            toast.error("Deleted Successfully", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          } catch (error) {
            console.error("Error deleting branch:", error);
            // alert("Failed to delete branch");
          }
        }}
        onCancel={() => setBranchToDelete(null)}
        message="Do you really want to delete this Expense?"
      />
    </div>
  );
}

export default Expenses;
