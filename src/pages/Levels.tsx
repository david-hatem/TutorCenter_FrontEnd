import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2, Trash2Icon } from "lucide-react";
import type { Level } from "../types";
import { createLevel, updateLevel } from "../services/api";
import axios from "axios";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Bounce, ToastContainer, toast } from "react-toastify";

const data: Level[] = [
  {
    id: 1,
    nom_niveau: "2BAC",
    description: "2BAC description",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 2,
    nom_niveau: "1BAC",
    description: "First year of Baccalaureate program",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 3,
    nom_niveau: "3EME",
    description: "Third year of secondary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 4,
    nom_niveau: "2EME",
    description: "Second year of secondary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 5,
    nom_niveau: "1ERE",
    description: "First year of secondary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 6,
    nom_niveau: "6EME",
    description: "Sixth grade of primary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 7,
    nom_niveau: "5EME",
    description: "Fifth grade of primary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
  {
    id: 8,
    nom_niveau: "4EME",
    description: "Fourth grade of primary education",
    created_at: "2024-10-23T16:35:04.530455Z",
  },
];

interface LevelFormData {
  nom_niveau: string;
  description: string;
}

function LevelDetails({
  level,
  onClose,
}: {
  level: Level;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom du niveau
        </label>
        <p className="mt-1 text-sm text-gray-900">{level.nom_niveau}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <p className="mt-1 text-sm text-gray-900">{level.description}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date de création
        </label>
        <p className="mt-1 text-sm text-gray-900">
          {new Date(level.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function Levels() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [levels, setLevels] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<number | null>(null);

  const columns: ColumnDef<Level>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Nom du niveau",
      accessorKey: "nom_niveau",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {row.original.nom_niveau}
        </span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Date de création",
      accessorKey: "created_at",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => row.original.onView?.(row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => row.original.onEdit?.(row.original)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLevelToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetch("https://deltapi.website:444/niveau_list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLevels(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [levelToDelete]);

  const handleAddLevel = (formData: LevelFormData) => {
    const newLevel: Level = {
      ...formData,
      // id: formData.id,
      created_at: new Date().toISOString(),
    };
    // setLevels([...levels, newLevel]);
  };

  const handleEditLevel = (formData: LevelFormData) => {
    if (!selectedLevel) return;

    const updatedLevels = levels?.map((level) =>
      level.id === selectedLevel.id ? { ...level, ...formData } : level
    );
    setLevels(updatedLevels);
  };

  const handleViewLevel = (level: Level) => {
    setSelectedLevel(level);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (level: Level) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  const levelsWithActions = levels?.map((level) => ({
    ...level,
    onView: handleViewLevel,
    onEdit: handleEditClick,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  function LevelForm({
    onSubmit,
    onClose,
    initialData,
  }: {
    onSubmit: (data: LevelFormData) => void;
    onClose: () => void;
    initialData?: Level;
  }) {
    const [formData, setFormData] = useState<LevelFormData>({
      nom_niveau: initialData?.nom_niveau || "",
      description: initialData?.description || "",
    });

    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit(formData);
    //   onClose();
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const createdLev = !initialData
        ? await createLevel(formData)
        : await updateLevel(formData, initialData?.id);
      setLevels([...levels, createdLev]);

      onSubmit(formData);
      onClose();
      if (!initialData) {
        if (createdLev) {
          // alert("Level created successfully!");
        } else {
          // alert("Failed to create level.");
        }
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du niveau *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.nom_niveau}
            onChange={(e) =>
              setFormData({ ...formData, nom_niveau: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (optionnelle)
          </label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
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
            {initialData ? "Mettre à jour le niveau" : "Ajouter un niveau"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Niveaux</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter un niveau
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={levelsWithActions}
          searchPlaceholder="Rechercher des niveaux..."
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un niveau"
      >
        <LevelForm
          onSubmit={handleAddLevel}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLevel(null);
        }}
        title="Mettre à jour le niveau"
      >
        {selectedLevel && (
          <LevelForm
            onSubmit={handleEditLevel}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedLevel(null);
            }}
            initialData={selectedLevel}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedLevel(null);
        }}
        title="Détails du niveau"
      >
        {selectedLevel && (
          <LevelDetails
            level={selectedLevel}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedLevel(null);
            }}
          />
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={levelToDelete !== null}
        onConfirm={async () => {
          try {
            await axios.delete(
              `https://deltapi.website:444/niveaux/delete/${levelToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted level
            setLevels(levels.filter((level) => level.id !== levelToDelete));
            setLevelToDelete(null);
            // Show success message
            toast.error("Supprimé avec succès", {
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
            // alert("Level deleted successfully");
          } catch (error) {
            console.error("Error deleting level:", error);
            // alert("Failed to delete level");
            toast.error("Échec de la suppression", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              // transition: Bounce,
            });
          }
        }}
        onCancel={() => setLevelToDelete(null)}
        message="Êtes-vous sûr de vouloir supprimer ce niveau ? Cette action ne peut pas être annulée."
      />
    </div>
  );
}

export default Levels;
