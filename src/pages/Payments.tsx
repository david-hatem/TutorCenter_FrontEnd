import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import PaymentForm from "../components/PaymentForm";
import { ColumnDef } from "@tanstack/react-table";
import { Printer, PlusCircle } from "lucide-react";
import type { Payment, PaymentFormData, Group } from "../types";
import { fetchGroupeList } from "../services/api";

interface FiltersProps {
  groups: Group[];
  students: any[];
  filters: {
    groupId: number;
    studentId: number;
    filiereId: number;
    niveauId: number;
    startDate: string;
    endDate: string;
    month: string;
  };
  onFilterChange: (filters: any) => void;
}

function Filters({ groups, students, filters, onFilterChange }: FiltersProps) {
  // Get unique filieres and niveaux from groups
  const filieres = Array.from(new Set(groups.map(g => g.filiere?.id))).map(id => ({
    id,
    nom_filiere: groups.find(g => g.filiere?.id === id)?.filiere?.nom_filiere
  })).filter(f => f.id && f.nom_filiere);

  const niveaux = Array.from(new Set(groups.map(g => g.niveau?.id))).map(id => ({
    id,
    nom_niveau: groups.find(g => g.niveau?.id === id)?.niveau?.nom_niveau
  })).filter(n => n.id && n.nom_niveau);

  // List of months in French
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filière
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.filiereId || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, filiereId: Number(e.target.value) || 0, groupId: 0 })
          }
        >
          <option value="">Toutes les filières</option>
          {filieres.map((filiere) => (
            <option key={filiere.id} value={filiere.id}>
              {filiere.nom_filiere}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Niveau
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.niveauId || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, niveauId: Number(e.target.value) || 0, groupId: 0 })
          }
        >
          <option value="">Tous les niveaux</option>
          {niveaux.map((niveau) => (
            <option key={niveau.id} value={niveau.id}>
              {niveau.nom_niveau}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Étudiant
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.studentId || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, studentId: Number(e.target.value) || 0 })
          }
        >
          <option value="">Tous les étudiants</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.prenom} {student.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Groupe
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.groupId || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, groupId: Number(e.target.value) || 0 })
          }
        >
          <option value="">Tous les groupes</option>
          {groups
            .filter(group => 
              (!filters.filiereId || group.filiere?.id === filters.filiereId) &&
              (!filters.niveauId || group.niveau?.id === filters.niveauId)
            )
            .map((group) => (
              <option key={group.id} value={group.id}>
                {group.nom_groupe}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mois
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.month || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, month: e.target.value })
          }
        >
          <option value="">Tous les mois</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date début
        </label>
        <input
          type="date"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.startDate}
          onChange={(e) =>
            onFilterChange({ ...filters, startDate: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date fin
        </label>
        <input
          type="date"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.endDate}
          onChange={(e) =>
            onFilterChange({ ...filters, endDate: e.target.value })
          }
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<Payment>[] = [
  {
    header: "Étudiant",
    id: "student",
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
    header: "Montant",
    accessorKey: "montant",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
        {row.original.montant.toLocaleString()} MAD
      </span>
    ),
  },
  {
    header: "Frais d'inscription",
    accessorKey: "frais_inscription",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600">
        {row.original.frais_inscription ? `${row.original.frais_inscription.toLocaleString()} MAD` : '-'}
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "date_paiement",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.date_paiement).toLocaleDateString('fr-FR')}
      </span>
    ),
  },
  {
    header: "Mois",
    accessorKey: "month_name",
  },
  {
    header: "Statut",
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
    header: "Restant",
    accessorKey: "remaining",
    cell: ({ row }) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
        {row.original.remaining ? `${row.original.remaining.toLocaleString()} MAD` : '-'}
      </span>
    ),
  },
  {
    header: "Niveau & Filière",
    id: "niveau_filiere",
    cell: ({ row }) => (
      <div className="space-y-1">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs block w-fit">
          {row.original.groupe.niveau_info?.nom_niveau || 'N/A'}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs block w-fit">
          {row.original.groupe.filiere_info?.nom_filiere || 'N/A'}
        </span>
      </div>
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
          title="Imprimer"
        >
          <Printer className="w-4 h-4" />
        </button>
        {row.original.statut_paiement.toLowerCase() === "partial" && (
          <button
            onClick={() => row.original.onCompletePayment?.(row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Compléter le paiement"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    ),
  },
];

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
    month_name: "Juin"
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
    month_name: "Juin"
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
          <p>Mois : {payment.month_name}</p>
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

function Payments() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    groupId: 0,
    studentId: 0,
    filiereId: 0,
    niveauId: 0,
    startDate: "",
    endDate: "",
    month: "",
  });
  const [totalAmount, setTotalAmount] = useState(
    initialData.reduce((sum, payment) => sum + payment.montant, 0)
  );

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://deltapi.website:444/paiements/?ordering=-date_paiement"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPayments(data.results);
      
      // Extract unique students from payments
      const uniqueStudents = Array.from(
        new Map(
          data.results.map((payment) => [
            payment.etudiant.id,
            payment.etudiant,
          ])
        ).values()
      );
      setStudents(uniqueStudents);
      
      // Calculate total amount from filtered payments
      setTotalAmount(data.results.reduce((sum, p) => sum + p.montant, 0));
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    
    // Fetch groups
    const getGroups = async () => {
      try {
        const groupsData = await fetchGroupeList();
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    getGroups();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);

    // Apply filters
    let filtered = [...payments];

    if (newFilters.filiereId) {
      filtered = filtered.filter(
        (payment) => payment.groupe.filiere_info?.id === newFilters.filiereId
      );
    }

    if (newFilters.niveauId) {
      filtered = filtered.filter(
        (payment) => payment.groupe.niveau_info?.id === newFilters.niveauId
      );
    }

    if (newFilters.studentId) {
      filtered = filtered.filter(
        (payment) => payment.etudiant.id === newFilters.studentId
      );
    }

    if (newFilters.groupId) {
      filtered = filtered.filter(
        (payment) => payment.groupe.id === newFilters.groupId
      );
    }

    if (newFilters.startDate) {
      filtered = filtered.filter(
        (payment) =>
          new Date(payment.date_paiement) >= new Date(newFilters.startDate)
      );
    }

    if (newFilters.endDate) {
      filtered = filtered.filter(
        (payment) =>
          new Date(payment.date_paiement) <= new Date(newFilters.endDate)
      );
    }

    if (newFilters.month) {
      filtered = filtered.filter(
        (payment) => payment.month_name === newFilters.month
      );
    }

    // Add action handlers to each payment
    const enhancedPayments = filtered.map(payment => ({
      ...payment,
      onPrint: () => handlePrint(payment),
      onCompletePayment: () => handleCompletePayment(payment)
    }));

    setFilteredPayments(enhancedPayments);
    setTotalAmount(filtered.reduce((sum, p) => sum + p.montant, 0));
  };

  const handlePrint = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPrintModalOpen(true);
  };

  const handleCompletePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Add action handlers when payments are fetched
  useEffect(() => {
    const enhancedPayments = payments.map(payment => ({
      ...payment,
      onPrint: () => handlePrint(payment),
      onCompletePayment: () => handleCompletePayment(payment)
    }));
    setFilteredPayments(enhancedPayments);
  }, [payments]);

  const handleCreatePayment = async (paymentData: PaymentFormData) => {
    try {
      if (!selectedPayment?.montant_total) return;

      const remainingAmount =
        selectedPayment.montant_total - selectedPayment.montant;

      if (paymentData[0].montant > remainingAmount) {
        alert(`Le montant maximum restant est ${remainingAmount} MAD`);
        return;
      }

      // Prepare the payment data
      const completionPayment = {
        payments: [{
          ...paymentData[0],
          etudiant_id: selectedPayment.etudiant.id,
          groupe_id: selectedPayment.groupe.id,
          professeurs: selectedPayment.groupe.professeurs.map(p => p.id)
        }]
      };

      // Create new payment through API
      const response = await fetch(
        "https://deltapi.website:444/paiements/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completionPayment),
        }
      );

      if (response.ok) {
        // Fetch updated payments list
        fetchPayments();
        setIsModalOpen(false);
        setSelectedPayment(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Failed to complete payment: " + (error.message || "Unknown error"));
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

        <Filters
          groups={groups}
          students={students}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={filteredPayments}
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
