import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { ColumnDef } from "@tanstack/react-table";
import { X, Users, Trash2Icon, Edit, Eye } from "lucide-react";
import type { Group, Level, Branch, Subject, Teacher } from "../types";
import axios from "axios";
import createGroup, {
  fetchFiliereList,
  fetchGroupeList,
  fetchMatiereList,
  fetchNiveauList,
  fetchTeachersList,
  updateGroup,
} from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Bounce, toast } from "react-toastify";

interface GroupFormData {
  id: number;
  nom_groupe: string;
  niveau: number;
  filiere: number;
  max_etudiants: number;
  prix_subscription: number;
  professeurs: { id: number; commission_fixe: number }[];
  matieres: { id: number }[];
}

function Groups() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [groups, setGroups] = useState<Group[]>([
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
  //     prix_subscription: 1500,
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
  // ]);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setselectedGroup] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);

  const columns: ColumnDef<Group>[] = [
    {
      header: "Nom du groupe",
      accessorKey: "nom_groupe",
      cell: ({ row }) => (
        <div>
          <span className="font-medium text-blue-600 block">
            {row.original.nom_groupe}
          </span>
          <span className="text-xs text-gray-500">
            Créé le {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Niveau & Filière",
      id: "level_branch",
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs block w-fit">
            {row.original.niveau.nom_niveau}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs block w-fit">
            {row.original.filiere.nom_filiere}
          </span>
        </div>
      ),
    },
    {
      header: "Prix de l'abonnement",
      accessorKey: "prix_subscription",
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {row.original.prix_subscription?.toLocaleString()} MAD
        </span>
      ),
    },
    {
      header: "Capacité",
      id: "capacity",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">
              {row.original.max_etudiants}
            </span>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Étudiants maximum
          </span>
        </div>
      ),
    },
    {
      header: "Professeurs & Commissions",
      id: "teachers",
      cell: ({ row }) => (
        <div className="space-y-2">
          {row.original.professeurs.map((prof) => (
            <div
              key={prof.id}
              className="flex items-center justify-between text-sm border-b pb-1 last:border-0"
            >
              <span className="font-medium">
                {prof.prenom} {prof.nom}
              </span>
              <span className="text-green-600 font-medium">
                {prof.commission_fixe} MAD
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Matières",
      accessorKey: "matieres",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.matieres.map((subject) => (
            <span
              key={subject.id}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
            >
              {subject.nom_matiere}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => row.original?.onEdit?.(row.original)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGroupToDelete(row.original.id)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchGroupeList();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    getData();
  }, [groupToDelete]);

  const handleAddGroup = (formData: GroupFormData) => {
    const newGroup: Group = {
      id: formData.id,
      nom_groupe: formData.nom_groupe,
      niveau: {
        id: formData.niveau,
        nom_niveau:
          levels.find((l) => l.id === formData.niveau)?.nom_niveau || "",
      },
      filiere: {
        id: formData.filiere,
        nom_filiere:
          branches.find((b) => b.id === formData.filiere)?.nom_filiere || "",
      },
      max_etudiants: formData.max_etudiants,
      prix_subscription: formData.prix_subscription,
      professeurs: formData.professeurs.map((p) => ({
        ...p,
        nom: teachers.find((t) => t.id === p.id)?.nom || "",
        prenom: teachers.find((t) => t.id === p.id)?.prenom || "",
      })),
      matieres: formData.matieres.map((m) => ({
        ...m,
        nom_matiere: subjects.find((s) => s.id === m.id)?.nom_matiere || "",
      })),
      created_at: new Date().toISOString(),
    };

    // setGroups((prev) => [...prev, newGroup]);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleEditClick = (grp: Group) => {
    setselectedGroup(grp);
    setIsEditModalOpen(true);
  };

  const handleEditGrp = (formData) => {
    if (!selectedGroup) return;

    const updatedgrps = groups?.map((g) =>
      g.id === selectedGroup.id ? { ...g, ...formData } : g
    );
    setGroups(updatedgrps);
  };

  const grpsWithActions = groups?.map((g) => ({
    ...g,
    // onView: handleViewLevel,
    onEdit: handleEditClick,
  }));

  function GroupForm({
    onSubmit,
    onClose,
    initialData,
  }: {
    onSubmit: (data: GroupFormData) => void;
    onClose: () => void;
    initialData?: Group;
  }) {
    const [formData, setFormData] = useState<GroupFormData>({
      nom_groupe: initialData?.nom_groupe || "",
      niveau: initialData?.niveau?.id || 0,
      filiere: initialData?.filiere?.id || 0,
      max_etudiants: initialData?.max_etudiants || 30,
      prix_subscription: initialData?.prix_subscription || 0,
      professeurs: initialData?.professeurs || [],
      matieres: initialData?.matieres || [],
    });

    const [levels, setLevels] = useState<Level[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
      const mockData = {
        levels: [
          { id: 1, nom_niveau: "2BAC", description: "2BAC description" },
          { id: 2, nom_niveau: "1BAC", description: "1BAC Sciences" },
        ],
        branches: [
          {
            id: 1,
            nom_filiere: "Sciences Mathematiques",
            description: "Filiere de Sciences Mathematiques",
          },
          {
            id: 2,
            nom_filiere: "Sciences Physiques",
            description: "Filiere specialisée en physique et chimie",
          },
        ],
        subjects: [
          {
            id: 1,
            nom_matiere: "Mathematique",
            description: "Matiere Mathematique",
          },
          {
            id: 2,
            nom_matiere: "Physiques",
            description: "Sciences physiques et expériences",
          },
        ],
        teachers: [
          {
            id: 1,
            nom: "Amrani",
            prenom: "Youssef",
            specialite: "Mathematique",
          },
          { id: 2, nom: "Benali", prenom: "Fatima", specialite: "Physique" },
        ],
      };

      setLevels(mockData.levels);
      setBranches(mockData.branches);
      setSubjects(mockData.subjects);
      setTeachers(mockData.teachers);
    }, []);

    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   onSubmit(formData);
    //   onClose();
    // };

    useEffect(() => {
      const getData = async () => {
        const data = await fetchFiliereList();
        setBranches(data);
      };
      getData();
    }, []);

    useEffect(() => {
      const getData = async () => {
        const data = await fetchMatiereList();
        setSubjects(data);
      };
      getData();
    }, []);

    useEffect(() => {
      const getData = async () => {
        const data = await fetchNiveauList();
        setLevels(data);
      };
      getData();
    }, []);

    useEffect(() => {
      const getData = async () => {
        const data = await fetchTeachersList();
        setTeachers(data);
      };
      getData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const createdgrp = !initialData
        ? await createGroup(formData)
        : await updateGroup(formData, initialData?.id);
      setGroups((prev) => [...prev, createdgrp]);

      onSubmit(formData);
      onClose();
      if (createdgrp) {
        // alert("Group created successfully!");
      } else {
        // alert("Failed to create group.");
      }
    };

    const handleAddTeacher = () => {
      setFormData((prev) => ({
        ...prev,
        professeurs: [...prev.professeurs, { id: 0, commission_fixe: 150.0 }],
      }));
    };

    const handleRemoveTeacher = (index: number) => {
      setFormData((prev) => ({
        ...prev,
        professeurs: prev.professeurs.filter((_, i) => i !== index),
      }));
    };

    const handleTeacherChange = (
      index: number,
      field: "id" | "commission_fixe",
      value: number
    ) => {
      setFormData((prev) => ({
        ...prev,
        professeurs: prev.professeurs.map((teacher, i) =>
          i === index ? { ...teacher, [field]: value } : teacher
        ),
      }));
    };

    const handleSubjectsChange = (selectedIds: number[]) => {
      setFormData((prev) => ({
        ...prev,
        matieres: selectedIds.map((id) => ({ id })),
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du groupe
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.nom_groupe}
            onChange={(e) =>
              setFormData({ ...formData, nom_groupe: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Niveau
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.niveau || ""}
            onChange={(e) =>
              setFormData({ ...formData, niveau: Number(e.target.value) })
            }
          >
            <option value="">Sélectionner un niveau</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.nom_niveau}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filière
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.filiere || ""}
            onChange={(e) =>
              setFormData({ ...formData, filiere: Number(e.target.value) })
            }
          >
            <option value="">Sélectionner une filière</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nom_filiere}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre maximum d'étudiants
          </label>
          <input
            type="number"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.max_etudiants}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_etudiants: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix de l'abonnement
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.prix_subscription}
            onChange={(e) =>
              setFormData({
                ...formData,
                prix_subscription: parseFloat(e.target.value),
              })
            }
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Professeurs
            </label>
            <button
              type="button"
              onClick={handleAddTeacher}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Ajouter un professeur
            </button>
          </div>
          <div className="space-y-2">
            {formData.professeurs.map((teacher, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                <select
                  required
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={teacher.id || ""}
                  onChange={(e) =>
                    handleTeacherChange(index, "id", Number(e.target.value))
                  }
                >
                  <option value="">Sélectionner un professeur</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.prenom} {t.nom} - {t.specialite}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Commission"
                  className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={teacher.commission_fixe || ""}
                  onChange={(e) =>
                    handleTeacherChange(
                      index,
                      "commission_fixe",
                      Number(e.target.value)
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTeacher(index)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matières
          </label>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <label key={subject.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={formData.matieres.some((m) => m.id === subject.id)}
                  onChange={(e) => {
                    const currentIds = formData.matieres.map((m) => m.id);
                    if (e.target.checked) {
                      handleSubjectsChange([...currentIds, subject.id]);
                    } else {
                      handleSubjectsChange(
                        currentIds.filter((id) => id !== subject.id)
                      );
                    }
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {subject.nom_matiere}
                </span>
              </label>
            ))}
          </div>
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
            {initialData ? "Mettre à jour le groupe" : "Ajouter un groupe"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Groupes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter un groupe
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={columns}
          data={grpsWithActions}
          searchPlaceholder="Rechercher des groupes..."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un nouveau groupe"
      >
        <GroupForm
          onSubmit={handleAddGroup}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Mettre à jour le groupe"
      >
        {selectedGroup && (
          <GroupForm
            onSubmit={handleEditGrp}
            onClose={() => setIsEditModalOpen(false)}
            initialData={selectedGroup}
          />
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={groupToDelete !== null}
        onConfirm={async () => {
          try {
            await axios.delete(
              `http://167.114.0.177:81/groupes/delete/${groupToDelete}/`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // Update the UI by removing the deleted group
            setGroups(groups.filter((group) => group.id !== groupToDelete));
            setGroupToDelete(null);
            // Show success message
            // alert("Group deleted successfully!");
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
            console.error("Error deleting group:", error);
            // alert("Failed to delete group");
          }
        }}
        onCancel={() => setGroupToDelete(null)}
        message="Voulez-vous vraiment supprimer ce groupe ?"
      />
    </div>
  );
}

const levels = [
  { id: 1, nom_niveau: "2BAC", description: "2BAC description" },
  { id: 2, nom_niveau: "1BAC", description: "1BAC Sciences" },
];

const branches = [
  {
    id: 1,
    nom_filiere: "Sciences Mathematiques",
    description: "Filiere de Sciences Mathematiques",
  },
  {
    id: 2,
    nom_filiere: "Sciences Physiques",
    description: "Filiere specialisée en physique et chimie",
  },
];

const subjects = [
  { id: 1, nom_matiere: "Mathematique", description: "Matiere Mathematique" },
  {
    id: 2,
    nom_matiere: "Physiques",
    description: "Sciences physiques et expériences",
  },
];

const teachers = [
  { id: 1, nom: "Amrani", prenom: "Youssef", specialite: "Mathematique" },
  { id: 2, nom: "Benali", prenom: "Fatima", specialite: "Physique" },
];

export default Groups;
