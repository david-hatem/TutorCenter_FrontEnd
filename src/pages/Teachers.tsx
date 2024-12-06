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
      header: "First Name",
      accessorKey: "prenom",
    },
    {
      header: "Last Name",
      accessorKey: "nom",
    },
    {
      header: "Specialty",
      accessorKey: "specialite",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {row.original.specialite}
        </span>
      ),
    },
    {
      header: "Birth Date",
      accessorKey: "date_naissance",
      cell: ({ row }) =>
        new Date(row.original.date_naissance).toLocaleDateString(),
    },
    {
      header: "Phone",
      accessorKey: "telephone",
    },
    {
      header: "Gender",
      accessorKey: "sexe",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.sexe === "M"
              ? "bg-blue-100 text-blue-800"
              : "bg-pink-100 text-pink-800"
          }`}
        >
          {row.original.sexe === "M" ? "Male" : "Female"}
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
    fetch("http://162.19.205.65:81/professeur_list/")
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

    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit({
    //     ...formData,
    //     id: Date.now(),
    //     created_at: new Date().toISOString(),
    //   });
    //   onClose();
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const createdTch = await createTeacher(formData);
      setTeachers([...teachers, createdTch]);

      onSubmit(formData);
      onClose();
      if (createdTch) {
        // alert("Teacher created successfully!");
      } else {
        // alert("Failed to create group.");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
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
              Last Name
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
            Specialty
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
            Birth Date
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.date_naissance}
            onChange={(e) =>
              setFormData({ ...formData, date_naissance: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.telephone}
            onChange={(e) =>
              setFormData({ ...formData, telephone: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.adresse}
            onChange={(e) =>
              setFormData({ ...formData, adresse: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.sexe}
            onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nationality
          </label>
          <input
            type="text"
            required
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
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Teacher
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Teacher
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={teachersWithActions}
          searchPlaceholder="Search teachers..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teacher"
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
              `http://162.19.205.65:81/professeurs/delete/${teacherToDelete}/`,
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
            console.error("Error deleting teacher:", error);
            // alert("Failed to delete teacher");
          }
        }}
        onCancel={() => setTeacherToDelete(null)}
        message="Do you really want to delete this teacher?"
      />
    </div>
  );
}

export default Teachers;
