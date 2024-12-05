import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, PiggyBank } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { updateTeacher } from "../services/api";
import Modal from "../components/Modal";

interface TeacherDetails {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  sexe: string;
  nationalite: string;
  specialite: string;
  created_at: string;
  groupes: {
    id: number;
    nom_groupe: string;
    commission_fixe: number;
    filiere: {
      id: number;
      nom_filiere: string;
    };
    niveau: {
      id: number;
      nom_niveau: string;
    };
    max_etudiants: number;
    matieres: {
      id: number;
      nom_matiere: string;
    }[];
    etudiants: any[];
    total_etudiants: number;
  }[];
  commissions: {
    id: number;
    montant: number;
    date_comission: string;
    statut_comission: string;
    etudiant: {
      id: number;
      nom: string;
      prenom: string;
    };
    groupe: {
      id: number;
      nom_groupe: string;
    };
  }[];
  total_commissions: number;
  total_groupes: number;
}

function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = React.useState<TeacherDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React.useEffect(() => {
  //   // Simulating API call
  //   setTimeout(() => {
  //     setTeacher({
  //       id: 1,
  //       nom: "Amrani",
  //       prenom: "Youssef",
  //       telephone: "+2126778901230",
  //       adresse: "789 Avenue Hassan II, Marrakech",
  //       date_naissance: "1985-03-12",
  //       sexe: "M",
  //       nationalite: "Marocain",
  //       specialite: "Mathematique",
  //       created_at: "2024-10-25T19:14:26.785819Z",
  //       groupes: [
  //         {
  //           id: 38,
  //           nom_groupe: "ttttttt",
  //           commission_fixe: 100.0,
  //           filiere: {
  //             id: 3,
  //             nom_filiere: "Sciences Experimentales",
  //           },
  //           niveau: {
  //             id: 2,
  //             nom_niveau: "1BAC",
  //           },
  //           max_etudiants: 30,
  //           matieres: [
  //             {
  //               id: 2,
  //               nom_matiere: "Physiques",
  //             },
  //             {
  //               id: 1,
  //               nom_matiere: "Mathematique",
  //             },
  //             {
  //               id: 3,
  //               nom_matiere: "SVT",
  //             },
  //           ],
  //           etudiants: [],
  //           total_etudiants: 0,
  //         },
  //       ],
  //       commissions: [
  //         {
  //           id: 1,
  //           montant: 120.0,
  //           date_comission: "2024-06-15T00:00:00Z",
  //           statut_comission: "Paid",
  //           etudiant: {
  //             id: 1,
  //             nom: "Doe",
  //             prenom: "Odim1",
  //           },
  //           groupe: {
  //             id: 1,
  //             nom_groupe: "Pack Math et PC",
  //           },
  //         },
  //         // ... more commissions
  //       ],
  //       total_commissions: 2870.0,
  //       total_groupes: 5,
  //     });
  //     setIsLoading(false);
  //   }, 1000);
  // }, [id]);

  useEffect(() => {
    const fetchProfesseursDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://162.19.205.65:81/professeurs/${id}/details/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfesseursDetails();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Teacher not found</p>
        <Link
          to="/teachers"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Teachers
        </Link>
      </div>
    );
  }

  function EditTeacherForm({
    onSubmit,
    onClose,
  }: {
    onSubmit: (data: any) => void;
    onClose: () => void;
  }) {
    const [formData, setFormData] = useState({
      nom: teacher?.nom,
      prenom: teacher?.prenom,
      telephone: teacher?.telephone,
      adresse: teacher?.adresse,
      date_naissance: teacher?.date_naissance,
      sexe: teacher?.sexe,
      nationalite: teacher?.nationalite,
      specialite: teacher?.specialite,
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
      const createdTch = await updateTeacher(formData, id);
      onSubmit(formData);
      onClose();
      // if (createdTch) {
      //   alert("Teacher created successfully!");
      // } else {
      //   alert("Failed to create group.");
      // }
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
            Update Teacher
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/teachers"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium">
                {teacher.prenom} {teacher.nom}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Specialty</label>
              <p className="font-medium">{teacher.specialite}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Birth Date</label>
              <p className="font-medium">
                {new Date(teacher.date_naissance).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium">{teacher.telephone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="font-medium">{teacher.adresse}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="font-medium">
                {teacher.sexe === "M" ? "Male" : "Female"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nationality</label>
              <p className="font-medium">{teacher.nationalite}</p>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Groups</h2>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">
                {teacher.total_groupes} group(s)
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {teacher.groupes.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{group.nom_groupe}</h3>
                  <span className="text-sm text-green-600 font-medium">
                    ${group.commission_fixe}/student
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Level:</span>
                    <span className="text-sm font-medium">
                      {group.niveau.nom_niveau}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Branch:</span>
                    <span className="text-sm font-medium">
                      {group.filiere.nom_filiere}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Subjects:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {group.matieres.map((matiere) => (
                        <span
                          key={matiere.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {matiere.nom_matiere}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Students:</span>
                    <span className="text-sm font-medium">
                      {group.total_etudiants} / {group.max_etudiants}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commissions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Commissions</h2>
            <div className="flex items-center space-x-2">
              <PiggyBank className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">
                ${teacher.total_commissions.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {teacher.commissions.map((commission) => (
              <div
                key={commission.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    ${commission.montant.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {commission.etudiant.prenom} {commission.etudiant.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    {commission.groupe.nom_groupe}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      commission.statut_comission === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {commission.statut_comission}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(commission.date_comission).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Student"
      >
        <EditTeacherForm
          onSubmit={() => {}}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default TeacherDetails;
