import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2Icon } from "lucide-react";
import { createSortiesBanque, updateSortiesBanque } from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

interface BankWithdrawal {
  id: number;
  date: string;
  mode_paiement: "CHEQUE" | "VIREMENT" | "ESPECES" | "CARTE";
  montant: number;
  created_at: string;
}

const initialData: BankWithdrawal[] = [
  {
    id: 1,
    date: "2024-03-15",
    mode_paiement: "Chèque",
    montant: 2500.0,
    created_at: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    date: "2024-03-14",
    mode_paiement: "Virement",
    montant: 1800.0,
    created_at: "2024-03-14T15:45:00Z",
  },
  {
    id: 3,
    date: "2024-03-13",
    mode_paiement: "Espèces",
    montant: 750.0,
    created_at: "2024-03-13T09:20:00Z",
  },
  {
    id: 4,
    date: "2024-03-12",
    mode_paiement: "Carte Bancaire",
    montant: 1200.0,
    created_at: "2024-03-12T14:15:00Z",
  },
];

interface BankWithdrawalFormData {
  id: number;
  date: string;
  mode_paiement: BankWithdrawal["mode_paiement"];
  montant: number;
}

function BankWithdrawals() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBankWithdrawal, setSelectedBankWithdrawal] =
    useState<BankWithdrawal | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

  const columns: ColumnDef<BankWithdrawal>[] = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: "Mode de Paiement",
      accessorKey: "mode_paiement",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            {
              CHEQUE: "bg-blue-100 text-blue-800",
              VIREMENT: "bg-green-100 text-green-800",
              ESPECES: "bg-yellow-100 text-yellow-800",
              CARTE: "bg-purple-100 text-purple-800",
            }[row.original.mode_paiement]
          }`}
        >
          {row.original.mode_paiement.toLowerCase()}
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
        const response = await fetch("https://deltapi.website:444/sorties-banque/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setWithdrawals(result); // Store data in state
      } catch (err) {
        // setError(err.message); // Handle errors
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  const handleAddWithdrawal = (formData: BankWithdrawalFormData) => {
    const newWithdrawal: BankWithdrawal = {
      ...formData,
      // id: Date.now(),
      created_at: new Date().toISOString(),
    };
    // setWithdrawals([newWithdrawal, ...withdrawals]);
  };

  const handleEditWithdrawal = (formData: BankWithdrawalFormData) => {
    if (!selectedBankWithdrawal) return;

    const updatedBW = withdrawals.map((bw) =>
      bw.id === selectedBankWithdrawal.id ? { ...bw, ...formData } : bw
    );
    setWithdrawals(updatedBW);
  };

  const handleViewBranch = (branch: BankWithdrawal) => {
    setSelectedBankWithdrawal(branch);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (d: BankWithdrawal) => {
    setSelectedBankWithdrawal(d);
    setIsEditModalOpen(true);
  };

  const branchesWithActions = withdrawals.map((w) => ({
    ...w,
    onView: handleEditWithdrawal,
    onEdit: handleEditClick,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalAmount = withdrawals.reduce(
    (sum, withdrawal) => sum + withdrawal.montant,
    0
  );

  function BankWithdrawalForm({
    onSubmit,
    onClose,
    initialData,
  }: {
    onSubmit: (data: BankWithdrawalFormData) => void;
    onClose: () => void;
    initialData?: BankWithdrawal;
  }) {
    const [formData, setFormData] = useState<BankWithdrawalFormData>({
      date: initialData?.date || new Date().toISOString().split("T")[0],
      mode_paiement: initialData?.mode_paiement || "CHEQUE",
      montant: initialData?.montant || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const createdData = !initialData
        ? await createSortiesBanque(formData)
        : await updateSortiesBanque(formData, initialData?.id);
      setWithdrawals([...withdrawals, createdData]);
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
            Mode de Paiement
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.mode_paiement}
            onChange={(e) =>
              setFormData({
                ...formData,
                mode_paiement: e.target
                  .value as BankWithdrawal["mode_paiement"],
              })
            }
          >
            <option value="CHEQUE">Chèque</option>
            <option value="VIREMENT">Virement</option>
            <option value="ESPECES">Espèces</option>
            <option value="CARTE">Carte Bancaire</option>
          </select>
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
          <h1 className="text-2xl font-bold text-gray-900">Sorties Banque</h1>
          <p className="text-sm text-gray-500">
            Total: {totalAmount.toLocaleString()} MAD
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Sortie</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={branchesWithActions}
          searchPlaceholder="Rechercher des sorties..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Sortie Banque"
      >
        <BankWithdrawalForm
          onSubmit={handleAddWithdrawal}
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
          <BankWithdrawalForm
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
              `https://deltapi.website:444/sorties-banque/${branchToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted branch
            setWithdrawals(
              withdrawals.filter((branch) => branch.id !== branchToDelete)
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
        message="Do you really want to delete this withdrawal?"
      />
    </div>
  );
}

export default BankWithdrawals;
