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
  // const [formData, setFormData] = useState<PaymentFormData[]>([
  //   {
  //     montant: remainingAmount || 0,
  //     frais_inscription: 0,
  //     // statut_paiement: "",
  //     etudiant_id: initialStudentId || 0,
  //     groupe_id: groups[0]?.id || 0,
  //     commission_percentage: 100,
  //   },
  // ]);

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

  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     etudiant_id: initialStudentId || prev.etudiant_id,
  //     groupe_id: groups[0]?.id || prev.groupe_id,
  //     montant: remainingAmount || prev.montant,
  //   }));
  // }, [initialStudentId, groups, remainingAmount]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (formData.montant <= 0) {
  //     alert("Amount must be greater than 0");
  //     return;
  //   }
  //   if (remainingAmount && formData.montant > remainingAmount) {
  //     alert(`The maximum remaining amount is $${remainingAmount}`);
  //     return;
  //   }
  //   onSubmit(formData);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.montant <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (isCompletion) {
      await updatePayment({ montant: formData[0].montant }, id);
      fetch();
      return;
    }
    // const createdPay = await createPayment(formData);
    const createdPay = await createPayment({ payments: formData });
    setPays(createdPay);
    onSubmit(formData);
    onClose();
    // if (createdPay) {
    //   alert("Payment created successfully!");
    // } else {
    //   alert("Failed to create group.");
    // }
  };

  const printPayment = () => {
    const printContent = document.getElementById("printable-payment");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
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
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .font-bold { font-weight: bold; }
            .text-2xl { font-size: 1.5rem; }
            .text-sm { font-size: 0.875rem; }
            .text-gray-500 { color: #6b7280; }
            .border-t { border-top: 1px solid #e5e7eb; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  function PrintablePayment({ payments }: { payments: any[] }) {
    return (
      <div className="p-8 bg-white" id="printable-payment">
        {payments?.map((payment) => {
          return (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Reçu de Paiement</h1>
                <p className="text-gray-500">#{payment?.payment?.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h2 className="font-bold mb-2">Informations de l'Étudiant</h2>
                  <p>
                    {payment?.payment?.etudiant.prenom}{" "}
                    {payment?.payment?.etudiant.nom}
                  </p>
                  <p>{payment?.payment?.etudiant.telephone}</p>
                  <p>{payment?.payment?.etudiant.adresse}</p>
                </div>
                <div className="text-right">
                  <h2 className="font-bold mb-2">Détails du Paiement</h2>
                  <p>
                    Date :{" "}
                    {new Date(
                      payment?.payment?.date_paiement
                    ).toLocaleDateString()}
                  </p>
                  <p>Statut : {payment?.payment?.statut_paiement}</p>
                  <p>Groupe : {payment?.payment?.groupe.nom_groupe}</p>
                  <p>Montant Restant : {payment?.payment?.remaining} MAD</p>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Montant Payé :</span>
                  <span>{payment?.payment?.montant.toLocaleString()} MAD</span>
                </div>
                {payment?.payment?.montant_total &&
                  payment?.payment?.statut_paiement === "Partiel" && (
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Montant Total :</span>
                      <span>
                        {payment?.payment?.montant_total.toLocaleString()} MAD
                      </span>
                    </div>
                  )}
                {/* <div className="flex justify-between">
                  <span className="font-bold">Taux de Commission :</span>
                  <span>{payment?.payment?.commission_percentage}%</span>
                </div> */}
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Merci pour votre paiement !</p>
                <p>Ceci est un document généré par ordinateur.</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const [fields, setFields] = useState<{ id: number; value: string }[]>([
    { id: Date.now(), value: "" },
  ]);
  const [buttonsDisabled, setButtonsDisabled] = useState(
    Array(groups.length).fill(false) // Initialize an array with `false` values
  );
  // Add a new field
  // const handleAddField = () => {
  //   setFields((prevFields) => [
  //     ...prevFields,
  //     { id: Date.now(), value: "" }, // Add a new field with an empty value
  //   ]);
  // };

  // Remove a specific field
  // const handleRemoveField = (id: number) => {
  //   setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  // };
  // Handle change in a specific field
  // const handleFieldChange = (id: number, value: string) => {
  //   setFields((prevFields) =>
  //     prevFields.map((field) => (field.id === id ? { ...field, value } : field))
  //   );
  // };

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
        console.error("formDataList is not an array:", prev);
        return [];
      }
      return [
        ...prev,
        {
          montant: 0,
          frais_inscription: 0,
          etudiant_id: initialStudentId,
          groupe_id: 0,
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
      {Array.isArray(formData) &&
        formData.map((field, index) => {
          if (index <= groups.length - 1) {
            return (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    max={remainingAmount}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={field?.montant || ""}
                    onChange={(e) => {
                      // setFormData({
                      //   ...formData,
                      //   montant: parseFloat(e.target.value),
                      // });
                      handleFieldChange(
                        index,
                        "montant",
                        parseFloat(e.target.value)
                      );
                    }}
                  />
                  {remainingAmount && (
                    <p className="mt-1 text-sm text-gray-500">
                      Remaining amount: {remainingAmount.toLocaleString()} MAD
                    </p>
                  )}
                </div>

                {!isCompletion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Fee
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={field?.frais_inscription || 0}
                      onChange={(e) => {
                        // setFormData({
                        //   ...formData,
                        //   frais_inscription: parseFloat(e.target.value),
                        // });
                        handleFieldChange(
                          index,
                          "frais_inscription",
                          parseFloat(e.target.value)
                        );
                      }}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      One-time registration fee for new students
                    </p>
                  </div>
                )}

                {/* {!isCompletion && !initialStudentId && students.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student
                    </label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={field?.etudiant_id || ""}
                      onChange={(e) => {
                        // setFormData({
                        //   ...formData,
                        //   etudiant_id: parseInt(e.target.value),
                        // });
                        handleFieldChange(index, "etudiant_id", e.target.value);
                      }}
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.prenom} {student.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}

                {!isCompletion && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Group
                      </label>
                      <select
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={field?.groupe_id || ""}
                        onChange={(e) => {
                          // setFormData({
                          //   ...formData,
                          //   groupe_id: parseInt(e.target.value),
                          // });
                          handleFieldChange(index, "groupe_id", e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          Select a group
                        </option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.nom_groupe}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Commission Percentage
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={field?.commission_percentage || 0}
                        onChange={(e) => {
                          // setFormData({
                          //   ...formData,
                          //   commission_percentage: parseFloat(e.target.value),
                          // });
                          handleFieldChange(
                            index,
                            "commission_percentage",
                            parseFloat(e.target.value)
                          );
                        }}
                      />
                    </div>
                  </>
                )}
                {!isCompletion && (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveField(index);
                        // setData((prevItems) =>
                        //   prevItems.filter((_, i) => i !== index)
                        // );
                      }}
                      className="px-2 py-2 text-sm font-medium text-white bg-rose-500 rounded-md hover:bg-rose-700"
                    >
                      <Minus size={15} />
                    </button>
                    <button
                      disabled={buttonsDisabled[index]}
                      type="button"
                      onClick={() => {
                        // if (
                        //   formData?.montant > 0 &&
                        //   formData?.frais_inscription > 0 &&
                        //   formData?.etudiant_id !== null &&
                        //   formData?.groupe_id !== null &&
                        //   formData?.commission_percentage > 0
                        // ) {
                        setButtonsDisabled((prev) => {
                          const updated = [...prev];
                          updated[index] = true; // Disable the button at the clicked index
                          return updated;
                        });
                        setData((prev) => [...prev, formData]);
                        // }
                      }}
                      className="px-2 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700"
                    >
                      <Check size={15} />
                    </button>
                  </div>
                )}
              </>
            );
          }
        })}

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
          {isCompletion ? "Complete Payment" : "Create Payment"}
        </button>
        {!isCompletion && (
          <>
            <button
              type="button"
              onClick={handleAddField}
              className="px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                printPayment();
                setIsPrintModalOpen(true);
                console.log(pays);
                // fetch2();
              }}
              className="px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Printer size={15} />
            </button>
          </>
        )}
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
          }}
          title="Print Payments"
        >
          <PrintablePayment payments={pays} />
          <div className="flex justify-end space-x-3 mt-6 no-print">
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={printPayment}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Print
            </button>
          </div>
        </Modal>
      </div>
    </form>
  );
}

export default PaymentForm;
