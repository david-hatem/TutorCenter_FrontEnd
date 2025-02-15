import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2Icon } from "lucide-react";
import type { Teacher } from "../types";
import { createTeacher } from "../services/api";
import axios from "axios";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Bounce, toast } from "react-toastify";

const data: Teacher[] = [
  {
    id: 1,
    nom: "Amrani",
    prenom: "Youssef",
    telephone: "+2126778901230",
    adresse: "789 Avenue Hassan II, Marrakech",
    date_naissance: "1985-03-12",
    sexe: "M",
    nationalite: "Marocain",
    specialite: "Mathematique",
    created_at: "2024-10-25T19:14:26.785819Z",
  },
  {
    id: 2,
    nom: "Benali",
    prenom: "Fatima",
    telephone: "+2126612345678",
    adresse: "456 Rue Mohammed V, Rabat",
    date_naissance: "1988-07-25",
    sexe: "F",
    nationalite: "Marocain",
    specialite: "Physique",
    created_at: "2024-10-26T10:20:15.123456Z",
  },
];

function Teachers() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);

  const columns: ColumnDef<Teacher>[] = [
    {
      header: "Prénom",
      accessorKey: "prenom",
    },
    {
      header: "Nom",
      accessorKey: "nom",
    },
    {
      header: "Spécialité",
      accessorKey: "specialite",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {row.original.specialite}
        </span>
      ),
    },
    {
      header: "Date de naissance",
      accessorKey: "date_naissance",
      cell: ({ row }) => {
        const date = row.original.date_naissance;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
    },
    {
      header: "Téléphone",
      accessorKey: "telephone",
    },
    {
      header: "Genre",
      accessorKey: "sexe",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.sexe === "M"
              ? "bg-blue-100 text-blue-800"
              : "bg-pink-100 text-pink-800"
          }`}
        >
          {row.original.sexe === "M" ? "Masculin" : "Féminin"}
        </span>
      ),
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
            onClick={() => setTeacherToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetch("https://deltapi.website:444/professeur_list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTeachers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [teacherToDelete]);

  const handleAddTeacher = (newTeacher: Teacher) => {
    // setTeachers([...teachers, newTeacher]);
  };

  const handleViewTeacher = (teacher: Teacher) => {
    navigate(`/teachers/${teacher.id}`);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    // Handle edit functionality
  };

  const teachersWithActions = teachers.map((teacher) => ({
    ...teacher,
    onView: handleViewTeacher,
    onEdit: handleEditTeacher,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  function TeacherForm({
    onSubmit,
    onClose,
  }: {
    onSubmit: (data: any) => void;
    onClose: () => void;
  }) {
    const [formData, setFormData] = useState({
      nom: "",
      prenom: "",
      telephone: "",
      adresse: "",
      date_naissance: "",
      sexe: "M",
      nationalite: "",
      specialite: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Create a copy of the form data
      const submissionData = { ...formData };
      
      // Remove empty optional fields
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === "" || submissionData[key] === null) {
          delete submissionData[key];
        }
      });

      const createdTch = await createTeacher(submissionData);
      if (createdTch) {
        // Fetch fresh list of teachers
        const response = await fetch("https://deltapi.website:444/professeur_list/");
        if (response.ok) {
          const updatedTeachers = await response.json();
          setTeachers(updatedTeachers);
        }
        onSubmit(formData);
        onClose();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Spécialité
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.specialite}
            onChange={(e) =>
              setFormData({ ...formData, specialite: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de naissance
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.date_naissance}
            onChange={(e) =>
              setFormData({ ...formData, date_naissance: e.target.value || undefined })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.telephone}
            onChange={(e) =>
              setFormData({ ...formData, telephone: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.adresse}
            onChange={(e) =>
              setFormData({ ...formData, adresse: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.sexe}
            onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nationalité
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.nationalite}
            onChange={(e) =>
              setFormData({ ...formData, nationalite: e.target.value })
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
            Ajouter un enseignant
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Enseignants</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter un enseignant
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={teachersWithActions}
          searchPlaceholder="Rechercher un enseignant..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un enseignant"
      >
        <TeacherForm
          onSubmit={handleAddTeacher}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={teacherToDelete !== null}
        onConfirm={async () => {
          try {
            await axios.delete(
              `https://deltapi.website:444/professeurs/delete/${teacherToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted teacher
            setTeachers(
              teachers.filter((teacher) => teacher.id !== teacherToDelete)
            );
            setTeacherToDelete(null);
            // Show success message
            // alert("Teacher deleted successfully");
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
          } catch (error) {
            console.error("Error deleting teacher:", error);
            // alert("Failed to delete teacher");
          }
        }}
        onCancel={() => setTeacherToDelete(null)}
        message="Voulez-vous vraiment supprimer cet enseignant ?"
      />
    </div>
  );
}

export default Teachers;
