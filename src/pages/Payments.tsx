import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import PaymentForm from "../components/PaymentForm";
import { ColumnDef } from "@tanstack/react-table";
import { Printer, PlusCircle } from "lucide-react";
import type { Payment, PaymentFormData } from "../types";

const columns: ColumnDef<Payment>[] = [
  {
    header: "Student",
    accessorFn: (row) => `${row.etudiant.prenom} ${row.etudiant.nom}`,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.etudiant.prenom} {row.original.etudiant.nom}
        </div>
        <div className="text-sm text-gray-500">
          {row.original.groupe.nom_groupe}
        </div>
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "montant",
    cell: ({ row }) => (
      <div>
        <span className="font-medium">
          {row.original.montant.toLocaleString()} MAD
        </span>
        {row.original.montant_total &&
          row.original.statut_paiement === "Partial" && (
            <div className="text-sm text-gray-500">
              of {row.original.montant_total.toLocaleString()} MAD
            </div>
          )}
      </div>
    ),
  },
  {
    header: "Date",
    accessorKey: "date_paiement",
    cell: ({ row }) =>
      new Date(row.original.date_paiement).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
  },
  {
    header: "Status",
    accessorKey: "statut_paiement",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.statut_paiement.toLowerCase() === "paid"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.original.statut_paiement.toLowerCase()}
      </span>
    ),
  },
  {
    header: "Remaining",
    accessorKey: "remaining",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
        {row.original.remaining ? `${row.original.remaining.toLocaleString()} MAD` : '-'}
      </span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          onClick={() => row.original.onPrint?.(row.original)}
          className="p-1 text-gray-600 hover:text-gray-800"
          title="Print payment"
        >
          <Printer className="w-4 h-4" />
        </button>
        {row.original.statut_paiement.toLowerCase() === "partial" && (
          <button
            onClick={() => row.original.onCompletePayment?.(row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Complete payment"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    ),
  },
];

function PrintablePayment({ payment }: { payment: Payment }) {
  return (
    <div className="p-8 bg-white" id="printable-payment">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Reçu de Paiement</h1>
        <p className="text-gray-500">#{payment.id}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h2 className="font-bold mb-2">Informations de l'Étudiant</h2>
          <p>
            {payment.etudiant.prenom} {payment.etudiant.nom}
          </p>
          <p>{payment.etudiant.telephone}</p>
          <p>{payment.etudiant.adresse}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold mb-2">Détails du Paiement</h2>
          <p>Date : {new Date(payment.date_paiement).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
          <p>Statut : {payment.statut_paiement}</p>
          <p>Groupe : {payment.groupe.nom_groupe}</p>
          <p>Montant Restant : {payment.remaining} MAD</p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-bold">Montant Payé :</span>
          <span>{payment.montant.toLocaleString()} MAD</span>
        </div>
        {payment.montant_total && payment.statut_paiement === "Partiel" && (
          <div className="flex justify-between mb-2">
            <span className="font-bold">Montant Total :</span>
            <span>{payment.montant_total.toLocaleString()} MAD</span>
          </div>
        )}
        {/* <div className="flex justify-between">
          <span className="font-bold">Taux de Commission :</span>
          <span>{payment.commission_percentage}%</span>
        </div> */}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Merci pour votre paiement !</p>
        <p>Ceci est un document généré par ordinateur.</p>
      </div>
    </div>
  );
}

const initialData: Payment[] = [
  {
    id: 1,
    montant: 500.0,
    montant_total: 1000.0,
    date_paiement: "2024-06-15T00:00:00Z",
    statut_paiement: "Partial",
    etudiant: {
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
    groupe: {
      id: 1,
      nom_groupe: "Pack Math et PC",
      niveau: 1,
      max_etudiants: 30,
      filiere: 1,
      professeurs: [
        {
          id: 1,
          nom: "Amrani",
          prenom: "Youssef",
          commission_fixe: 150.0,
        },
      ],
      matieres: [
        {
          id: 1,
          nom_matiere: "Mathematique",
        },
      ],
      created_at: "2024-10-25T19:14:26.780492Z",
    },
    commission_percentage: 50.0,
  },
  {
    id: 2,
    montant: 800.0,
    date_paiement: "2024-06-20T00:00:00Z",
    statut_paiement: "Paid",
    etudiant: {
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
    groupe: {
      id: 2,
      nom_groupe: "Sciences de la Vie",
      niveau: 2,
      max_etudiants: 25,
      filiere: 2,
      professeurs: [
        {
          id: 2,
          nom: "Benani",
          prenom: "Sara",
          commission_fixe: 140.0,
        },
      ],
      matieres: [
        {
          id: 2,
          nom_matiere: "Biologie",
        },
      ],
      created_at: "2024-10-26T10:20:15.123456Z",
    },
    commission_percentage: 60.0,
  },
];

function Payments() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(
    initialData.reduce((sum, payment) => sum + payment.montant, 0)
  );

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://167.114.0.177:81/paiements/?ordering=-date_paiement"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPayments(data.results);
      setTotalAmount(data.results.reduce((sum, p) => sum + p.montant, 0));
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePrint = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPrintModalOpen(true);
  };

  const handleCompletePayment = (payment: Payment) => {
    if (!payment.montant_total) return;

    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCreatePayment = async (paymentData: PaymentFormData) => {
    try {
      if (!selectedPayment?.montant_total) return;

      const remainingAmount =
        selectedPayment.montant_total - selectedPayment.montant;

      if (paymentData.montant > remainingAmount) {
        alert(`The maximum remaining amount is $${remainingAmount}`);
        return;
      }

      // Create new payment through API
      const response = await fetch(
        "http://167.114.0.177:81/paiements/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (response.ok) {
        // Fetch updated payments list
        const updatedResponse = await fetch(
          "http://167.114.0.177:81/paiements/"
        );
        const data = await updatedResponse.json();

        setPayments(data.results);
        setTotalAmount(data.results.reduce((sum, p) => sum + p.montant, 0));
        setIsModalOpen(false);
        setSelectedPayment(null);
        alert("Payment completed successfully");
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Failed to complete payment");
    }
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

  const paymentsWithActions = payments.map((payment) => ({
    ...payment,
    onPrint: handlePrint,
    onCompletePayment: handleCompletePayment,
  }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-500">
              Total amount: {totalAmount.toLocaleString()} MAD
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Payment
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={paymentsWithActions}
            searchPlaceholder="Search payments..."
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        title={selectedPayment ? "Complete Payment" : "Add New Payment"}
      >
        <PaymentForm
          fetch={fetchPayments}
          id={selectedPayment?.id}
          onSubmit={handleCreatePayment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPayment(null);
          }}
          initialStudentId={selectedPayment?.etudiant.id}
          students={[]}
          groups={[selectedPayment?.groupe].filter(Boolean)}
          isCompletion={!!selectedPayment}
          remainingAmount={
            selectedPayment?.montant_total
              ? selectedPayment.montant_total - selectedPayment.montant
              : undefined
          }
        />
      </Modal>

      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedPayment(null);
        }}
        title="Print Payment"
      >
        {selectedPayment && (
          <div>
            <PrintablePayment payment={selectedPayment} />
            <div className="flex justify-end space-x-3 mt-6 no-print">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={printPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Print
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Payments;
