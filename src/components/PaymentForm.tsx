import React, { useState, useEffect } from "react";
import type { PaymentFormData, Student, Group } from "../types";
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
    },
  ]);

  const [data, setData] = useState([]);
  const [pays, setPays] = useState<any>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [buttonsDisabled, setButtonsDisabled] = useState(
    Array(groups.length).fill(false) // Initialize an array with `false` values
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
    if (!data.groupe_id) {
      newErrors.groupe_id = "Veuillez sélectionner un groupe";
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
        onClose();
        fetch();
        fetch2();
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
        console.error("formDataList is not an array:", prev); // Debugging
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
      {formData.map((field, index) => (
        <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Montant (MAD) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  max={remainingAmount}
                  className={`block w-full rounded-md ${
                    errors.montant 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={field?.montant}
                  onChange={(e) => {
                    handleFieldChange(
                      index,
                      "montant",
                      parseFloat(e.target.value)
                    );
                  }}
                />
                {errors.montant && (
                  <p className="mt-1 text-sm text-red-600">{errors.montant}</p>
                )}
              </div>
              {remainingAmount && (
                <p className="mt-1 text-sm text-gray-500">
                  Montant restant: {remainingAmount.toLocaleString()} MAD
                </p>
              )}
            </div>

            {!isCompletion && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frais d'inscription (MAD)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`block w-full rounded-md ${
                        errors.frais_inscription 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={field?.frais_inscription}
                      onChange={(e) => {
                        handleFieldChange(
                          index,
                          "frais_inscription",
                          parseFloat(e.target.value)
                        );
                      }}
                    />
                    {errors.frais_inscription && (
                      <p className="mt-1 text-sm text-red-600">{errors.frais_inscription}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Groupe *
                  </label>
                  <select
                    required
                    className={`mt-1 block w-full rounded-md ${
                      errors.groupe_id 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    value={field?.groupe_id}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "groupe_id",
                        parseInt(e.target.value)
                      )
                    }
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Commission (%) *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      required
                      className={`block w-full rounded-md ${
                        errors.commission_percentage 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={field?.commission_percentage}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "commission_percentage",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    {errors.commission_percentage && (
                      <p className="mt-1 text-sm text-red-600">{errors.commission_percentage}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {formData.length > 1 && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Minus size={16} className="mr-1" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        {!isCompletion && (
          <button
            type="button"
            onClick={handleAddField}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un paiement
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isCompletion ? "Terminer le paiement" : "Créer le paiement"}
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;
