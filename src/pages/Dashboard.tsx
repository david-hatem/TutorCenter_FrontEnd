import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Wallet,
  PiggyBank,
  CloudFog,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../components/StatsCard";

const monthlyData = [
  { name: "Jan", payments: 4000, commissions: 2400 },
  { name: "Feb", payments: 3000, commissions: 1398 },
  { name: "Mar", payments: 2000, commissions: 9800 },
  { name: "Apr", payments: 2780, commissions: 3908 },
  { name: "May", payments: 1890, commissions: 4800 },
  { name: "Jun", payments: 2390, commissions: 3800 },
];

const expensesAndWithdrawalsData = [
  { name: "Jan", expenses: 1200, withdrawals: 2500 },
  { name: "Feb", expenses: 1800, withdrawals: 3200 },
  { name: "Mar", expenses: 1500, withdrawals: 2800 },
  { name: "Apr", expenses: 2200, withdrawals: 3500 },
  { name: "May", expenses: 1700, withdrawals: 2900 },
  { name: "Jun", expenses: 1900, withdrawals: 3100 },
];

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [weekFinance, setWeekFinance] = useState([]);
  const [monthFinance, setMonthFinance] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "http://167.114.0.177:81/dashboard/metrics/"
        );
        if (!response.ok) {
          throw new Error(`Error fetching metrics: ${response.status}`);
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchMonthFinance = async () => {
      try {
        const response = await fetch(
          "http://167.114.0.177:81/dashboard/financial-metrics/"
        );
        if (!response.ok) {
          throw new Error(`Error fetching metrics: ${response.status}`);
        }
        const data = await response.json();
        setMonthFinance(data.data);
        console.log(data);
      } catch (err) {
        setError(err?.message);
      }
    };
    const fetchWeekFinance = async () => {
      try {
        const response = await fetch(
          "http://167.114.0.177:81/dashboard/weekly-financial-metrics/"
        );
        if (!response.ok) {
          throw new Error(`Error fetching metrics: ${response.status}`);
        }
        const data = await response.json();
        setWeekFinance(data.data);
        console.log("data.data");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMetrics();
    fetchMonthFinance();
    fetchWeekFinance();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Nombre d'étudiants"
          value={metrics?.student_metrics?.total_students}
          icon={Users}
          trend={12}
          trendLabel="vs mois dernier"
        />
        <StatsCard
          title="Nombre d'enseignants"
          value={metrics?.teacher_metrics?.total_teachers}
          icon={GraduationCap}
          trend={8}
          trendLabel="vs mois dernier"
        />
        <StatsCard
          title="Total des paiements"
          value={metrics?.payment_metrics?.total_amount}
          icon={Wallet}
          trend={24}
          trendLabel="vs mois dernier"
        />
        <StatsCard
          title="Total des commissions"
          value={metrics?.commission_metrics?.total_commission_amount}
          icon={PiggyBank}
          trend={18}
          trendLabel="vs mois dernier"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Aperçu des revenus mensuels
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthFinance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="depenses"
                  stroke="#3B82F6"
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="sorties-banque"
                  stroke="#10B981"
                  name="Bank Withdrawals"
                />
                <Line
                  type="monotone"
                  dataKey="recettes"
                  stroke="#EF4444"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Dépenses et retraits bancaires
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekFinance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="paiements" fill="#EF4444" name="Payments" />
                <Bar dataKey="commissions" fill="#8B5CF6" name="Commissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
