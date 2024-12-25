import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlusCircleIcon, Users, Wallet, X } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import PaymentForm from "../components/PaymentForm";
import type { PaymentFormData } from "../types";
import {
  addStudentGrp,
  createStudent,
  fetchGroupeList,
  updateStudent,
} from "../services/api";

interface StudentDetails {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone: string;
  adresse: string;
  sexe: string;
  nationalite: string;
  contact_urgence: string;
  created_at: string;
  groupes: {
    id: number;
    nom_groupe: string;
    niveau: {
      id: number;
      nom_niveau: string;
    };
    filiere: {
      id: number;
      nom_filiere: string;
    };
    matieres: {
      id: number;
      nom_matiere: string;
    }[];
    professeurs: {
      id: number;
      nom: string;
      prenom: string;
      commission_fixe: number;
    }[];
  }[];
  paiements: {
    id: number;
    montant: number;
    date_paiement: string;
    statut_paiement: string;
    groupe: string;
  }[];
  total_paiements: number;
  total_groupes: number;
  etablissement: string;
}

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGrp, setSelectedGrp] = useState(null);
  const [fields, setFields] = useState<{ id: number; value: string }[]>([]);

  const fetchEtudiantDetails = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://deltapi.website:444/etudiants/${id}/details/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEtudiantDetails();
  }, [id]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchGroupeList();
      setGroups(data);
    };
    getData();
  }, []);

  // Add a new field
  const handleAddField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { id: Date.now(), value: "" }, // Add a new field with an empty value
    ]);
  };

  // Remove a specific field
  const handleRemoveField = (id: number) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  // Handle change in a specific field
  const handleFieldChange = (id: number, value: string) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

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
    etablissement: string;
  }

  function EditStudentForm({
    onSubmit,
    onClose,
  }: {
    onSubmit: (data: StudentFormData) => void;
    onClose: () => void;
  }) {
    const [formData, setFormData] = useState<StudentFormData>({
      prenom: student?.prenom,
      nom: student?.nom,
      date_naissance: student?.date_naissance,
      telephone: student?.telephone,
      adresse: student?.adresse,
      sexe: student?.sexe,
      nationalite: student?.nationalite,
      contact_urgence: student?.contact_urgence,
      groupe_id: student?.groupes[0].id,
      etablissement: student?.etablissement,
    });

    const [groups, setGroups] = useState([]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const createdStd = await updateStudent(formData, id);
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
              Prénom
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={formData.prenom}
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
              defaultValue={formData?.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de naissance
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.date_naissance}
            onChange={(e) =>
              setFormData({ ...formData, date_naissance: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.telephone}
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.adresse}
            onChange={(e) =>
              setFormData({ ...formData, adresse: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sexe
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.sexe}
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.nationalite}
            onChange={(e) =>
              setFormData({ ...formData, nationalite: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact d'urgence
          </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.contact_urgence}
            onChange={(e) =>
              setFormData({ ...formData, contact_urgence: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Établissement
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.etablissement}
            onChange={(e) =>
              setFormData({ ...formData, etablissement: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Groupe
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={formData?.groupe_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, groupe_id: parseInt(e.target.value) })
            }
          >
            <option value="">Sélectionner un groupe</option>
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
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Mettre à jour l'étudiant
          </button>
        </div>
      </form>
    );
  }

  const handleAddPayment = async (paymentData: PaymentFormData) => {
    try {
      setIsPaymentModalOpen(false);
      await fetchEtudiantDetails(); // Refresh student data after payment
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleEditStudent = async (formData) => {
    try {
      const response = await updateStudent(formData, id);
      if (response) {
        // Fetch fresh student data after update
        const updatedResponse = await fetch(
          `https://deltapi.website:444/etudiants/${id}/details/`
        );
        if (!updatedResponse.ok) {
          throw new Error("Failed to fetch updated student details");
        }
        const updatedData = await updatedResponse.json();
        setStudent(updatedData);
        setIsModalOpen(false);
        // alert("Student updated successfully");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      // alert("Failed to update student");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Étudiant non trouvé</p>
        <Link
          to="/students"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Retour aux étudiants
        </Link>
      </div>
    );
  }

  // const addStdGrp = async () => {
  //   await addStudentGrp({
  //     group_id: Number(selectedGrp),
  //     student_id: Number(id),
  //   });
  // };

  const addStdGrp = async () => {
    try {
      await addStudentGrp({
        group_id: Number(selectedGrp),
        student_id: Number(id),
      });
      // Refresh student details after adding to group
      await fetchEtudiantDetails();
      // Clear the fields after successful addition
      setFields([]);
    } catch (error) {
      console.error("Error adding student to group:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/students"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Détails de l'étudiant</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Ajouter un paiement
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Éditer l'étudiant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nom complet</label>
              <p className="font-medium">
                {student.prenom} {student.nom}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date de naissance</label>
              <p className="font-medium">
                {student.date_naissance ? new Date(student.date_naissance).toLocaleDateString() : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Téléphone</label>
              <p className="font-medium">{student.telephone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Adresse</label>
              <p className="font-medium">{student.adresse}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sexe</label>
              <p className="font-medium">
                {student.sexe === "M" ? "Masculin" : "Féminin"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nationalité</label>
              <p className="font-medium">{student.nationalite}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Contact d'urgence</label>
              <p className="font-medium">{student.contact_urgence}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Établissement</label>
              <p className="font-medium">{student.etablissement}</p>
            </div>
          </div>
        </div>

        {/* Groupes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Groupes
              </label>
              <button
                type="button"
                onClick={handleAddField}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Ajouter un groupe
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 p-2 border rounded-lg"
                >
                  <select
                    required
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={field.value}
                    onChange={(e) => {
                      handleFieldChange(field.id, e.target.value);
                      setSelectedGrp(e.target.value);
                    }}
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groups.map((g) => (
                      <option key={g?.id} value={g?.id}>
                        {g?.nom_groupe}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addStdGrp}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Groupes</h2>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">
                {student.total_groupes} groupe(s)
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {student.groupes.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">{group.nom_groupe}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Niveau:</span>
                    <span className="text-sm font-medium">
                      {group.niveau.nom_niveau}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Filière:</span>
                    <span className="text-sm font-medium">
                      {group.filiere.nom_filiere}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Matières:</span>
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
                  <div>
                    <span className="text-sm text-gray-500">Professeurs:</span>
                    <div className="mt-1 space-y-1">
                      {group.professeurs.map((prof) => (
                        <div key={prof.id} className="text-sm">
                          {prof.prenom} {prof.nom}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paiements */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Paiements</h2>
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">
                {student.total_paiements.toLocaleString()} MAD
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {[...student.paiements]
              .sort((a, b) => new Date(b.date_paiement).getTime() - new Date(a.date_paiement).getTime())
              .map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {payment.montant.toLocaleString()} MAD
                  </p>
                  <p className="text-sm text-gray-500">{payment.groupe}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.statut_paiement.toLowerCase() === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.statut_paiement.toLowerCase()}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(payment.date_paiement).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Ajouter un paiement"
      >
        <PaymentForm
          onSubmit={handleAddPayment}
          onClose={() => setIsPaymentModalOpen(false)}
          initialStudentId={student.id}
          students={[]}
          groups={student.groupes}
          fetch={fetchEtudiantDetails}
          fetch2={fetchEtudiantDetails}
        />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Éditer l'étudiant"
      >
        <EditStudentForm
          onSubmit={handleEditStudent}
          onClose={() => setIsModalOpen(false)}
          initialData={student}
        />
      </Modal>
    </div>
  );
}

export default StudentDetails;
