import React, { useState, useEffect } from "react";
import type { PaymentFormData, Student, Group, Professeur } from "../types";
import { createPayment, fetchGroupeList, updatePayment } from "../services/api";
import { Check, Minus, Plus, Printer } from "lucide-react";
import { Paiement } from "./../types/index";
import Modal from "./Modal";

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onClose: () => void;
  fetch: () => void;
  fetch2: () => void;
  initialStudentId?: number;
  students: Student[];
  groups: Group[];
  isCompletion?: boolean;
  remainingAmount?: number;
  id?: number;
}

function PaymentForm({
  onSubmit,
  onClose,
  initialStudentId,
  students,
  groups,
  isCompletion,
  remainingAmount,
  id,
  fetch,
  fetch2,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData[]>([
    {
      montant: remainingAmount || 0,
      frais_inscription: 0,
      etudiant_id: initialStudentId || 0,
      groupe_id: groups[0]?.id || 0,
      commission_percentage: 100,
      professeurs: [], // Will be set in the parent component for completion payments
    },
  ]);

  useEffect(() => {
    if (isCompletion && remainingAmount) {
      setFormData([
        {
          ...formData[0],
          montant: remainingAmount,
        },
      ]);
    }
  }, [isCompletion, remainingAmount]);

  const [selectedProfesseurs, setSelectedProfesseurs] = useState<{[key: number]: number[]}>({});

  const handleProfesseurToggle = (paymentIndex: number, professeurId: number) => {
    setFormData((prev) => {
      const newData = [...prev];
      const currentProfesseurs = newData[paymentIndex].professeurs || [];
      
      if (currentProfesseurs.includes(professeurId)) {
        // Remove professor if already selected
        newData[paymentIndex] = {
          ...newData[paymentIndex],
          professeurs: currentProfesseurs.filter(id => id !== professeurId)
        };
      } else {
        // Add professor if not selected
        newData[paymentIndex] = {
          ...newData[paymentIndex],
          professeurs: [...currentProfesseurs, professeurId]
        };
      }
      
      return newData;
    });
  };

  const [data, setData] = useState([]);
  const [pays, setPays] = useState<any>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [buttonsDisabled, setButtonsDisabled] = useState(
    Array(groups.length).fill(false)
  );

  const validateForm = (data: PaymentFormData) => {
    const newErrors: {[key: string]: string} = {};
    
    if (data.montant <= 0) {
      newErrors.montant = "Le montant doit être supérieur à 0";
    }
    if (remainingAmount && data.montant > remainingAmount) {
      newErrors.montant = `Le montant maximum autorisé est ${remainingAmount} MAD`;
    }
    if (data.frais_inscription < 0) {
      newErrors.frais_inscription = "Les frais d'inscription ne peuvent pas être négatifs";
    }
    if (data.commission_percentage < 0 || data.commission_percentage > 100) {
      newErrors.commission_percentage = "La commission doit être comprise entre 0 et 100";
    }
    if (!isCompletion) {
      if (!data.groupe_id) {
        newErrors.groupe_id = "Veuillez sélectionner un groupe";
      }
      if (!data.professeurs || data.professeurs.length === 0) {
        newErrors.professeurs = "Veuillez sélectionner au moins un professeur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all form data entries
    const isValid = formData.every(validateForm);
    if (!isValid) return;

    try {
      if (isCompletion) {
        await updatePayment({ montant: formData[0].montant }, id);
        fetch();
        onClose();
        return;
      }

      const createdPay = await createPayment({ payments: formData });
      if (createdPay) {
        setPays(createdPay);
        onSubmit(formData);
        fetch();
        fetch2();

        // Log the response to see its structure
        console.log('Created payment response:', createdPay);

        // Process each payment in the response
        createdPay.forEach((paymentResponse) => {
          const payment = paymentResponse.payment; // Get the payment object from the response
          const printWindow = window.open("", "_blank");
          if (!printWindow) return;

          printWindow.document.write(`
            <html>
              <head>
                <title>Reçu de Paiement</title>
                <style>
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    line-height: 1.5;
                    margin: 0;
                    padding: 20px;
                  }
                  .print-content {
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  .text-center { text-align: center; }
                  .mb-8 { margin-bottom: 2rem; }
                  .mb-2 { margin-bottom: 0.5rem; }
                  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                  .font-bold { font-weight: bold; }
                  .text-2xl { font-size: 1.5rem; }
                  .text-sm { font-size: 0.875rem; }
                  .text-gray-500 { color: #6b7280; }
                  .border-t { border-top: 1px solid #e5e7eb; }
                  .pt-4 { padding-top: 1rem; }
                  @media print {
                    body { print-color-adjust: exact; }
                  }
                </style>
              </head>
              <body>
                <div class="print-content">
                  <div class="text-center mb-8">
                    <h1 class="text-2xl font-bold">Reçu de Paiement</h1>
                    <p class="text-sm text-gray-500">
                      Date: ${new Date(payment.date_paiement).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <div class="grid mb-8">
                    <div>
                      <h2 class="font-bold mb-2">Informations de l'étudiant</h2>
                      <p>Nom: ${payment.etudiant.prenom} ${payment.etudiant.nom}</p>
                      <p>Téléphone: ${payment.etudiant.telephone || 'Non spécifié'}</p>
                      <p>Adresse: ${payment.etudiant.adresse || 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <h2 class="font-bold mb-2">Détails du paiement</h2>
                      <p>Groupe: ${payment.groupe.nom_groupe}</p>
                      <p>Montant: ${payment.montant.toLocaleString()} MAD</p>
                      <p>Montant total: ${payment.montant_total.toLocaleString()} MAD</p>
                      <p>Statut: ${payment.statut_paiement}</p>
                      ${payment.remaining ? 
                        `<p>Montant restant: ${payment.remaining.toLocaleString()} MAD</p>` 
                        : ''}
                      ${payment.frais_inscription > 0 ? 
                        `<p>Frais d'inscription: ${payment.frais_inscription.toLocaleString()} MAD</p>` 
                        : ''}
                    </div>
                  </div>

                  ${payment.groupe.professeurs && payment.groupe.professeurs.length > 0 ? `
                    <div class="mb-8">
                      <h2 class="font-bold mb-2">Professeurs</h2>
                      <ul>
                        ${payment.groupe.professeurs.map(prof => 
                          `<li>${prof.prenom} ${prof.nom}</li>`
                        ).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  <div class="border-t pt-4 text-center text-sm text-gray-500">
                    <p>${paymentResponse.message}</p>
                    <p>Merci de votre confiance!</p>
                  </div>
                </div>
              </body>
            </html>
          `);

          printWindow.document.close();
          printWindow.focus();

          // Print after a short delay to ensure content is loaded
          setTimeout(() => {
            printWindow.print();
          }, 500);
        });

        onClose();
      } else {
        setErrors({ submit: "Failed to create payment. Please try again." });
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setErrors({ submit: "Failed to create payment. Please try again." });
    }
  };

  const handleRemoveField = (index: number) => {
    setFormData((prev) => {
      if (!Array.isArray(prev)) {
        console.error("formDataList is not an array:", prev);
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddField = () => {
    setFormData((prev) => {
      if (!Array.isArray(prev)) {
        return [
          {
            montant: 0,
            frais_inscription: 0,
            etudiant_id: initialStudentId || 0,
            groupe_id: groups[0]?.id || 0,
            commission_percentage: 100,
            professeurs: [],
          },
        ];
      }
      return [
        ...prev,
        {
          montant: 0,
          frais_inscription: 0,
          etudiant_id: initialStudentId || 0,
          groupe_id: groups[0]?.id || 0,
          commission_percentage: 100,
          professeurs: [],
        },
      ];
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof PaymentFormData,
    value: any
  ) => {
    setFormData((prev) => {
      if (!Array.isArray(prev)) {
        console.error("formDataList is not an array:", prev);
        return prev;
      }
      return prev.map((data, i) =>
        i === index ? { ...data, [field]: value } : data
      );
    });
  };

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.map((payment, index) => (
        <div key={index} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Montant {isCompletion ? "restant" : ""} (MAD)
            </label>
            <input
              type="number"
              value={payment.montant}
              onChange={(e) =>
                handleFieldChange(index, "montant", parseFloat(e.target.value))
              }
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.montant
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              required
            />
            {errors.montant && (
              <p className="mt-1 text-sm text-red-600">{errors.montant}</p>
            )}
          </div>

          {!isCompletion && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frais d'inscription (MAD)
                </label>
                <input
                  type="number"
                  value={payment.frais_inscription}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "frais_inscription",
                      parseFloat(e.target.value)
                    )
                  }
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.frais_inscription
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.frais_inscription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.frais_inscription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Étudiant
                </label>
                <select
                  value={payment.etudiant_id}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "etudiant_id",
                      parseInt(e.target.value)
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un étudiant</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.prenom} {student.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Groupe
                </label>
                <select
                  value={payment.groupe_id}
                  onChange={(e) => {
                    const groupId = parseInt(e.target.value);
                    handleFieldChange(index, "groupe_id", groupId);
                    // Reset selected professors when group changes
                    handleFieldChange(index, "professeurs", []);
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.groupe_id
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                >
                  <option value="">Sélectionner un groupe</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.nom_groupe}
                    </option>
                  ))}
                </select>
                {errors.groupe_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.groupe_id}</p>
                )}
              </div>

              {payment.groupe_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professeurs
                  </label>
                  <div className="space-y-2">
                    {groups
                      .find((g) => g.id === payment.groupe_id)
                      ?.professeurs.map((prof) => (
                        <label
                          key={prof.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={payment.professeurs.includes(prof.id)}
                            onChange={() =>
                              handleProfesseurToggle(index, prof.id)
                            }
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <span>
                            {prof.prenom} {prof.nom}
                          </span>
                        </label>
                      ))}
                  </div>
                  {errors.professeurs && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.professeurs}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isCompletion ? "Compléter" : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;
