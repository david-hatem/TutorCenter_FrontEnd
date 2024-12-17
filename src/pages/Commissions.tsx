import React, { useState, useRef, useEffect } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";
import { Printer, Search } from "lucide-react";
import type { Commission, Group, Teacher } from "../types";
import html2canvas from "html2canvas";
import { fetchGroupeList, fetchTeachersList } from "../services/api";
import jsPDF from "jspdf";
import { exportNestedDataToExcel } from "../utils";

// Filter component for better organization
interface FiltersProps {
  groups: Group[];
  teachers: Teacher[];
  filters: {
    groupId: number;
    teacherId: number;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filters: any) => void;
}

function Filters({ groups, teachers, filters, onFilterChange }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.groupId || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, groupId: Number(e.target.value) || 0 })
          }
        >
          <option value="">All Groups</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nom_groupe}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teacher
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.teacherId || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              teacherId: Number(e.target.value) || 0,
            })
          }
        >
          <option value="">All Teachers</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.prenom} {teacher.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
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
          End Date
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

const columns: ColumnDef<Commission>[] = [
  {
    header: "Teacher",
    accessorFn: (row) => `${row.professeur.prenom} ${row.professeur.nom}`,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.professeur.prenom} {row.original.professeur.nom}
        </div>
        <div className="text-sm text-gray-500">
          {row.original.professeur.specialite}
        </div>
      </div>
    ),
  },
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
      <span className="font-medium">
        {row.original.montant.toLocaleString()} MAD
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "date_comission",
    cell: ({ row }) =>
      new Date(row.original.date_comission).toLocaleDateString(),
  },
  {
    header: "Status",
    accessorKey: "statut_comission",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.statut_comission.toLowerCase() === "paid"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.original.statut_comission.toLowerCase()}
      </span>
    ),
  },
];

// Sample data for groups and teachers
const sampleGroups: Group[] = [
  {
    id: 1,
    nom_groupe: "Pack Math et PC",
    niveau: { id: 1, nom_niveau: "2BAC" },
    filiere: { id: 1, nom_filiere: "Sciences Mathematiques" },
    max_etudiants: 30,
    professeurs: [],
    matieres: [],
    created_at: "",
  },
  {
    id: 2,
    nom_groupe: "Sciences de la Vie",
    niveau: { id: 2, nom_niveau: "1BAC" },
    filiere: { id: 2, nom_filiere: "SVT" },
    max_etudiants: 25,
    professeurs: [],
    matieres: [],
    created_at: "",
  },
];

const sampleTeachers: Teacher[] = [
  {
    id: 1,
    nom: "Amrani",
    prenom: "Youssef",
    telephone: "",
    adresse: "",
    date_naissance: "",
    sexe: "M",
    nationalite: "",
    specialite: "Mathematique",
    created_at: "",
  },
  {
    id: 2,
    nom: "Benali",
    prenom: "Fatima",
    telephone: "",
    adresse: "",
    date_naissance: "",
    sexe: "F",
    nationalite: "",
    specialite: "Physique",
    created_at: "",
  },
];

const initialData: Commission[] = [
  {
    id: 1,
    montant: 120.0,
    date_comission: "2024-06-15T00:00:00Z",
    statut_comission: "Paid",
    professeur: {
      id: 1,
      nom: "Amrani",
      prenom: "Youssef",
      telephone: "+2126778901230000000",
      adresse: "789 Avenue Hassan II, Marrakech",
      date_naissance: "1985-03-12",
      sexe: "M",
      nationalite: "Marocain",
      specialite: "Mathematique",
      created_at: "2024-10-25T19:14:26.785819Z",
    },
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
      filiere: 1,
    },
  },
  {
    id: 2,
    montant: 150.0,
    date_comission: "2024-06-20T00:00:00Z",
    statut_comission: "Paid",
    professeur: {
      id: 2,
      nom: "Benali",
      prenom: "Fatima",
      telephone: "+2126612345678",
      adresse: "456 Rue Mohammed V, Rabat",
      date_naissance: "1988-07-25",
      sexe: "F",
      nationalite: "Marocain",
      specialite: "Physique",
      created_at: "2024-10-26T10:20:15.123456Z",
    },
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
      filiere: 2,
    },
  },
];

function PrintableCommissions({
  data,
  filters,
}: {
  data: Commission[];
  filters: any;
}) {
  const totalAmount = data.reduce(
    (sum, commission) => sum + commission.montant,
    0
  );

  return (
    <div className="p-8 print-content">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Commissions Report</h1>
        <p className="text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Print Filters */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filters Applied</h2>
        <div className="space-y-1 text-sm">
          {filters.groupId && (
            <p>
              Group:{" "}
              {sampleGroups.find((g) => g.id === filters.groupId)?.nom_groupe}
            </p>
          )}
          {filters.teacherId && (
            <p>
              Teacher:{" "}
              {sampleTeachers.find((t) => t.id === filters.teacherId)?.prenom}{" "}
              {sampleTeachers.find((t) => t.id === filters.teacherId)?.nom}
            </p>
          )}
          {filters.startDate && (
            <p>From: {new Date(filters.startDate).toLocaleDateString()}</p>
          )}
          {filters.endDate && (
            <p>To: {new Date(filters.endDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <p>Total Commissions: {totalAmount.toLocaleString()} MAD</p>
        <p>Total Records: {data.length}</p>
      </div>

      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left border-b">Teacher</th>
            <th className="px-4 py-2 text-left border-b">Student</th>
            <th className="px-4 py-2 text-left border-b">Amount</th>
            <th className="px-4 py-2 text-left border-b">Date</th>
            <th className="px-4 py-2 text-left border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((commission) => (
            <tr key={commission.id} className="border-b">
              <td className="px-4 py-2">
                <div>
                  <div className="font-medium">
                    {commission.professeur.prenom} {commission.professeur.nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    {commission.professeur.specialite}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div>
                  <div className="font-medium">
                    {commission.etudiant.prenom} {commission.etudiant.nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    {commission.groupe.nom_groupe}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                {commission.montant.toLocaleString()} MAD
              </td>
              <td className="px-4 py-2">
                {new Date(commission.date_comission).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{commission.statut_comission.toLowerCase()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={2} className="px-4 py-2 font-medium">
              Total
            </td>
            <td colSpan={3} className="px-4 py-2 font-medium">
              {totalAmount.toLocaleString()} MAD
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>End of Report</p>
      </div>
    </div>
  );
}

function Commissions() {
  const [isLoading, setIsLoading] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [filters, setFilters] = useState({
    groupId: 0,
    teacherId: 0,
    startDate: "",
    endDate: "",
  });
  const printRef = useRef<HTMLDivElement>(null);

  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchTeachersList();
      setTeachers(data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchGroupeList();
      setGroups(data);
    };
    getData();
  }, []);

  useEffect(() => {
    // Fetch data from the API
    fetch("https://deltapi.website:444/commissions/?ordering=-date_comission")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCommissions(data.results);
        setFilteredCommissions(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        // setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);

    // Apply filters
    let filtered = [...commissions];

    if (newFilters.groupId) {
      filtered = filtered.filter(
        (commission) => commission.groupe.id === newFilters.groupId
      );
    }

    if (newFilters.teacherId) {
      filtered = filtered.filter(
        (commission) => commission.professeur.id === newFilters.teacherId
      );
    }

    if (newFilters.startDate) {
      filtered = filtered.filter(
        (commission) =>
          new Date(commission.date_comission) >= new Date(newFilters.startDate)
      );
    }

    if (newFilters.endDate) {
      filtered = filtered.filter(
        (commission) =>
          new Date(commission.date_comission) <= new Date(newFilters.endDate)
      );
    }

    setFilteredCommissions(filtered);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalAmount = filteredCommissions.reduce(
    (sum, commission) => sum + commission.montant,
    0
  );

  const handleExport = () => {
    console.log(filteredCommissions);
    exportNestedDataToExcel(filteredCommissions, "DATA.xlsx");
  };

  return (
    <>
      <div className="space-y-6 no-print">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commissions</h1>
            <p className="text-sm text-gray-500">
              Total commissions: {totalAmount.toLocaleString()} MAD
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleExport}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Record Commission
            </button>
          </div>
        </div>

        <Filters
          groups={groups}
          teachers={teachers}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="bg-white rounded-lg shadow p-6" id="pdf-table">
          <DataTable
            columns={columns}
            data={filteredCommissions}
            searchPlaceholder="Search commissions..."
          />
        </div>
      </div>

      {/* Printable version */}
      <div ref={printRef} className="hidden">
        <PrintableCommissions data={filteredCommissions} filters={filters} />
      </div>
    </>
  );
}

export default Commissions;
