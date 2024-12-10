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

  useEffect(() => {
    const fetchProfesseursDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://167.114.0.177:81/professeurs/${id}/details/`
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
        <p className="text-gray-500">Professeur non trouvé</p>
        <Link
          to="/teachers"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Retour aux professeurs
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      const createdTch = await updateTeacher(formData, id);
      onSubmit(formData);
      onClose();
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
            Téléphone
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
            Adresse
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
            Sexe
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
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Mettre à jour le professeur
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
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Détails du professeur</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Éditer le professeur
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nom complet</label>
              <p className="font-medium">
                {teacher.prenom} {teacher.nom}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Spécialité</label>
              <p className="font-medium">{teacher.specialite}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date de naissance</label>
              <p className="font-medium">
                {new Date(teacher.date_naissance).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Téléphone</label>
              <p className="font-medium">{teacher.telephone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Adresse</label>
              <p className="font-medium">{teacher.adresse}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Sexe</label>
              <p className="font-medium">
                {teacher.sexe === "M" ? "Masculin" : "Féminin"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nationalité</label>
              <p className="font-medium">{teacher.nationalite}</p>
            </div>
          </div>
        </div>

        {/* Groupes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Groupes</h2>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">
                {teacher.total_groupes} groupe(s)
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {teacher.groupes.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{group.nom_groupe}</h3>
                  <span className="text-sm text-green-600 font-medium">
                    {group.commission_fixe} MAD/étudiant
                  </span>
                </div>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Étudiants:</span>
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
                {teacher.total_commissions.toLocaleString()} MAD
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
                    {commission.montant.toLocaleString()} MAD
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
                    className={`px-2 py-1 rounded-full text-xs bg-green-100 text-green-800`}
                  >
                    {commission.statut_comission.toLowerCase()}
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
        title="Éditer le professeur"
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
