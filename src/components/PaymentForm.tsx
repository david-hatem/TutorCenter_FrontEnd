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
      commission_percentage: null,
      professeurs: groups[0]?.professeurs?.map(p => p.id) || [],
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
    if (data.commission_percentage !== null && (data.commission_percentage < 0 || data.commission_percentage > 100)) {
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

        // Open a single print window for all payments
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        // Start the HTML document
        printWindow.document.write(`
          <html>
            <head>
              <title>Reçus de Paiement</title>
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
                .payment-receipt {
                  border-bottom: 2px dashed #e5e7eb;
                  margin-bottom: 2rem;
                  padding-bottom: 2rem;
                }
                .payment-receipt:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
                }
                @media print {
                  body { print-color-adjust: exact; }
                  .payment-receipt { page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="print-content">
        `);

        // Add each payment receipt
        createdPay.forEach((paymentResponse, index) => {
          const payment = paymentResponse.payment;
          printWindow.document.write(`
            <div class="payment-receipt">
              <div class="text-center mb-8">
                <h1 class="text-2xl font-bold">Reçu de Paiement ${createdPay.length > 1 ? `#${index + 1}` : ''}</h1>
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
                  <p>Montant payé: ${payment.montant.toLocaleString()} MAD</p>
                  <p>Reste à payer: ${(payment.groupe.prix_subscription - payment.montant_total).toLocaleString()} MAD</p>
                  ${payment.frais_inscription > 0 ? 
                    `<p>Frais d'inscription: ${payment.frais_inscription.toLocaleString()} MAD</p>` 
                    : ''}
                </div>
              </div>
            </div>
          `);
        });

        // Close the HTML document
        printWindow.document.write(`
              </div>
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
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
            professeurs: groups[0]?.professeurs?.map(p => p.id) || [],
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
          professeurs: groups[0]?.professeurs?.map(p => p.id) || [],
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
  const [showInscription, setShowInscription] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.map((payment, index) => (
        <div key={index} className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Paiement {index + 1}</h3>
            {formData.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="text-red-600 hover:text-red-700 flex items-center"
              >
                <Minus className="h-4 w-4 mr-1" />
                Supprimer
              </button>
            )}
          </div>

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

          {/* Financial Details Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Prix Subscription Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix Souscription
              </label>
              <input
                type="number"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                value={groups.find(g => g.id === payment.groupe_id)?.prix_subscription || 0}
              />
            </div>

            {/* Commission Percentage Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="Entrez le % de commission"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={payment.commission_percentage || ''}
                onChange={(e) => {
                  const newCommissionPercentage = e.target.value === '' 
                    ? null 
                    : parseInt(e.target.value, 10);
                  
                  handleFieldChange(index, "commission_percentage", newCommissionPercentage);
                }}
              />
              {errors.commission_percentage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.commission_percentage}
                </p>
              )}
            </div>

            {/* Commission Calculation Display */}
            {payment.commission_percentage !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant Commission
                </label>
                <input
                  type="number"
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                  value={
                    groups.find(g => g.id === payment.groupe_id)?.prix_subscription 
                    ? Math.round((groups.find(g => g.id === payment.groupe_id)?.prix_subscription * payment.commission_percentage) / 100)
                    : 0
                  }
                />
              </div>
            )}
          </div>

          {!isCompletion && (
            <>
              {index === 0 && (
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="show-inscription"
                    checked={showInscription}
                    onChange={(e) => {
                      setShowInscription(e.target.checked);
                      if (!e.target.checked) {
                        // Reset inscription fee when unchecked
                        handleFieldChange(index, "frais_inscription", 0);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="show-inscription" className="ml-2 text-sm text-gray-700">
                    Première inscription
                  </label>
                </div>
              )}

              {index === 0 && showInscription && (
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
              )}

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
                      ?.professeurs.map((prof, profIndex) => {
                        const currentGroup = groups.find((g) => g.id === payment.groupe_id);
                        const matiere = currentGroup?.matieres[profIndex]?.nom_matiere;
                        return (
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
                              {matiere && (
                                <span className="text-gray-500 ml-1">
                                  - {matiere}
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
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

      {!isCompletion && (
        <button
          type="button"
          onClick={handleAddField}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un autre paiement
        </button>
      )}

      <div className="flex justify-end space-x-2 mt-6">
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
