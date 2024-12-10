import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2Icon } from "lucide-react";
import type { Subject } from "../types";
import { createSub, updateSub } from "../services/api";
import axios from "axios";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Bounce, toast } from "react-toastify";

const data: Subject[] = [
  {
    id: 1,
    nom_matiere: "Mathematique",
    description: "Matiere Mathematique",
    created_at: "2024-10-23T16:36:40.126861Z",
  },
  {
    id: 2,
    nom_matiere: "Physique",
    description: "Sciences physiques et expériences",
    created_at: "2024-10-23T16:37:40.126861Z",
  },
  {
    id: 3,
    nom_matiere: "Chimie",
    description: "Chimie organique et inorganique",
    created_at: "2024-10-23T16:38:40.126861Z",
  },
  {
    id: 4,
    nom_matiere: "Sciences de la Vie",
    description: "Biologie et sciences naturelles",
    created_at: "2024-10-23T16:39:40.126861Z",
  },
  {
    id: 5,
    nom_matiere: "Français",
    description: "Langue et littérature française",
    created_at: "2024-10-23T16:40:40.126861Z",
  },
  {
    id: 6,
    nom_matiere: "Arabe",
    description: "Langue et littérature arabe",
    created_at: "2024-10-23T16:41:40.126861Z",
  },
  {
    id: 7,
    nom_matiere: "Anglais",
    description: "Langue anglaise et communication",
    created_at: "2024-10-23T16:42:40.126861Z",
  },
  {
    id: 8,
    nom_matiere: "Histoire-Géographie",
    description: "Histoire du monde et géographie",
    created_at: "2024-10-23T16:43:40.126861Z",
  },
  {
    id: 9,
    nom_matiere: "Philosophie",
    description: "Philosophie et pensée critique",
    created_at: "2024-10-23T16:44:40.126861Z",
  },
  {
    id: 10,
    nom_matiere: "Informatique",
    description: "Programmation et technologies",
    created_at: "2024-10-23T16:45:40.126861Z",
  },
];

interface SubjectFormData {
  nom_matiere: string;
  description: string;
}

function SubjectDetails({
  subject,
  onClose,
}: {
  subject: Subject;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom de la matière
        </label>
        <p className="mt-1 text-sm text-gray-900">{subject.nom_matiere}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <p className="mt-1 text-sm text-gray-900">{subject.description}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Créé le
        </label>
        <p className="mt-1 text-sm text-gray-900">
          {new Date(subject.created_at).toLocaleDateString()}
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

function Subjects() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<number | null>(null);

  const columns: ColumnDef<Subject>[] = [
    {
      header: "Nom de la matière",
      accessorKey: "nom_matiere",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {row.original.nom_matiere}
        </span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Créé le",
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
            onClick={() => setSubToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
          <ConfirmationDialog
            isOpen={subToDelete !== null}
            onConfirm={async () => {
              await axios.delete(
                `http://167.114.0.177:81/matieres/delete/${subToDelete}/`,
                {
                  headers: {
                    "Content-Type": "application/json", // Define content type as JSON
                  },
                }
              );
              setSubjects(subjects.filter((s) => s.id !== subToDelete));
              setSubToDelete(null);
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
            }}
            onCancel={() => setSubToDelete(null)}
            message="Voulez-vous vraiment supprimer cette matière ?"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fetch data from the API
    fetch("http://167.114.0.177:81/matiere_list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSubjects(data);
        setIsLoading(false);
      })
      .catch((err) => {
        // setError(err.message);
        setIsLoading(false);
      });
  }, [subToDelete]);

  const handleAddSubject = (formData: SubjectFormData) => {
    const newSubject: Subject = {
      ...formData,
      // id: Date.now(),
      created_at: new Date().toISOString(),
    };
    // setSubjects([...subjects, newSubject]);
  };

  const handleEditSubject = (formData: SubjectFormData) => {
    if (!selectedSubject) return;

    const updatedSubjects = subjects.map((subject) =>
      subject.id === selectedSubject.id ? { ...subject, ...formData } : subject
    );
    setSubjects(updatedSubjects);
  };

  const handleViewSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const subjectsWithActions = subjects.map((subject) => ({
    ...subject,
    onView: handleViewSubject,
    onEdit: handleEditClick,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  function SubjectForm({
    onSubmit,
    onClose,
    initialData,
  }: {
    onSubmit: (data: SubjectFormData) => void;
    onClose: () => void;
    initialData?: Subject;
  }) {
    const [formData, setFormData] = useState<SubjectFormData>({
      nom_matiere: initialData?.nom_matiere || "",
      description: initialData?.description || "",
    });

    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit(formData);
    //   onClose();
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const createdSub = !initialData
        ? await createSub(formData)
        : await updateSub(formData, initialData.id);
      setSubjects([...subjects, createdSub]);

      onSubmit(formData);
      onClose();
      if (!initialData) {
        if (createdSub) {
          // alert("Subject created successfully!");
        } else {
          // alert("Failed to create subject.");
        }
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de la matière *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.nom_matiere}
            onChange={(e) =>
              setFormData({ ...formData, nom_matiere: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (optionnelle)
          </label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            {initialData ? "Mettre à jour la matière" : "Ajouter la matière"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Matières</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter une matière
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={subjectsWithActions}
          searchPlaceholder="Rechercher des matières..."
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter une nouvelle matière"
      >
        <SubjectForm
          onSubmit={handleAddSubject}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubject(null);
        }}
        title="Modifier la matière"
      >
        {selectedSubject && (
          <SubjectForm
            onSubmit={handleEditSubject}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSubject(null);
            }}
            initialData={selectedSubject}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSubject(null);
        }}
        title="Détails de la matière"
      >
        {selectedSubject && (
          <SubjectDetails
            subject={selectedSubject}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedSubject(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default Subjects;
