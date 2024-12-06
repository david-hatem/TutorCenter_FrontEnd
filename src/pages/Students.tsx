import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, DeleteIcon, Trash2Icon } from "lucide-react";
import type { Student, Group } from "../types";
import createGroup, { createStudent, fetchGroupeList } from "../services/api";
import axios from "axios";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Bounce, toast } from "react-toastify";

const data: Student[] = [
  {
    id: 1,
    nom: "Doe",
    prenom: "John",
    date_naissance: "2003-01-01",
    telephone: "123456789011111",
    adresse: "123 Main St",
    sexe: "M",
    nationalite: "French",
    contact_urgence: "98765432101111111",
    created_at: "2024-10-25T19:14:26.603176Z",
  },
  {
    id: 2,
    nom: "Smith",
    prenom: "Emma",
    date_naissance: "2004-03-15",
    telephone: "987654321011111",
    adresse: "456 Oak Avenue",
    sexe: "F",
    nationalite: "English",
    contact_urgence: "12345678901111111",
    created_at: "2024-10-26T10:20:15.123456Z",
  },
  {
    id: 3,
    nom: "Garcia",
    prenom: "Carlos",
    date_naissance: "2003-07-22",
    telephone: "555666777888999",
    adresse: "789 Pine Road",
    sexe: "M",
    nationalite: "Spanish",
    contact_urgence: "999888777666555",
    created_at: "2024-10-27T14:30:45.234567Z",
  },
];

// Add groups data
// const groups: Group[] = [
//   {
//     id: 1,
//     nom_groupe: "Pack Math et PC",
//     niveau: {
//       id: 1,
//       nom_niveau: "2BAC",
//     },
//     filiere: {
//       id: 1,
//       nom_filiere: "Sciences Mathematiques",
//     },
//     max_etudiants: 30,
//     professeurs: [
//       {
//         id: 1,
//         nom: "Amrani",
//         prenom: "Youssef",
//         commission_fixe: 150.0,
//       },
//     ],
//     matieres: [
//       {
//         id: 1,
//         nom_matiere: "Mathematique",
//       },
//     ],
//     created_at: "2024-10-25T19:14:26.780492Z",
//   },
//   {
//     id: 2,
//     nom_groupe: "Sciences de la Vie",
//     niveau: {
//       id: 2,
//       nom_niveau: "1BAC",
//     },
//     filiere: {
//       id: 2,
//       nom_filiere: "Sciences de la Vie et de la Terre",
//     },
//     max_etudiants: 25,
//     professeurs: [
//       {
//         id: 2,
//         nom: "Benani",
//         prenom: "Sara",
//         commission_fixe: 140.0,
//       },
//     ],
//     matieres: [
//       {
//         id: 2,
//         nom_matiere: "Biologie",
//       },
//     ],
//     created_at: "2024-10-26T10:20:15.123456Z",
//   },
// ];

interface StudentFormData {
  prenom: string;
  nom: string;
  date_naissance: string;
  telephone: string;
  adresse: string;
  sexe: string;
  nationalite: string;
  contact_urgence: string;
  groupe_id: number;
}

function Students() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const columns: ColumnDef<Student>[] = [
    {
      header: "First Name",
      accessorKey: "prenom",
    },
    {
      header: "Last Name",
      accessorKey: "nom",
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
      header: "Nationality",
      accessorKey: "nationalite",
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
            onClick={() => setStudentToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch("http://162.19.205.65:81/etudiant_list/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setIsLoading(false);
      });
  }, [studentToDelete]);

  const handleAddStudent = (formData: StudentFormData) => {
    const newStudent: Student = {
      ...formData,
      // id: Date.now(),
      created_at: new Date().toISOString(),
    };
    // setStudents([...students, newStudent]);
  };

  const handleViewStudent = (student: Student) => {
    navigate(`/students/${student.id}`);
  };

  const handleEditStudent = (student: Student) => {
    // Handle edit functionality
    console.log("Edit student:", student);
  };

  const studentsWithActions = students
    ? students.map((student) => ({
        ...student,
        onView: handleViewStudent,
        onEdit: handleEditStudent,
      }))
    : null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  function StudentForm({
    onSubmit,
    onClose,
  }: {
    onSubmit: (data: StudentFormData) => void;
    onClose: () => void;
  }) {
    const [formData, setFormData] = useState<StudentFormData>({
      prenom: "",
      nom: "",
      date_naissance: "",
      telephone: "",
      adresse: "",
      sexe: "M",
      nationalite: "",
      contact_urgence: "",
      groupe_id: 0,
    });

    const [groups, setGroups] = useState([]);

    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit(formData);
    //   onClose();
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const createdStd = await createStudent(formData);
      setStudents([...students, createdStd]);

      onSubmit(formData);
      onClose();
      if (createdStd) {
        // alert("Student created successfully!");
      } else {
        // alert("Failed to create group.");
      }
    };

    useEffect(() => {
      const getData = async () => {
        const data = await fetchGroupeList();
        setGroups(data);
      };
      getData();
    }, []);

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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Emergency Contact
          </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.contact_urgence}
            onChange={(e) =>
              setFormData({ ...formData, contact_urgence: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.groupe_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, groupe_id: parseInt(e.target.value) })
            }
          >
            <option value="">Select a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.nom_groupe} - {group.niveau.nom_niveau} (
                {group.filiere.nom_filiere})
              </option>
            ))}
          </select>
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
            Add Student
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={studentsWithActions}
          searchPlaceholder="Search students..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Student"
      >
        <StudentForm
          onSubmit={handleAddStudent}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={studentToDelete !== null}
        onConfirm={async () => {
          try {
            await axios.delete(
              `http://162.19.205.65:81/etudiants/delete/${studentToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted student
            setStudents(
              students.filter((student) => student.id !== studentToDelete)
            );
            setStudentToDelete(null);
            // Show success message
            // alert("Student deleted successfully");
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
            console.error("Error deleting student:", error);
            // alert("Failed to delete student");
          }
        }}
        onCancel={() => setStudentToDelete(null)}
        message="Do you really want to delete this student?"
      />
    </div>
  );
}

export default Students;
