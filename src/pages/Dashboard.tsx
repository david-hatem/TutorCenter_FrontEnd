import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Globe, 
  BookOpen, 
  CreditCard, 
  DollarSign, 
  Briefcase 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// Metric card component
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subText, 
  color = 'blue' 
}: { 
  title: string, 
  value: number | string, 
  icon: React.ComponentType, 
  subText?: string, 
  color?: string 
}) => {
  const colorVariants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 truncate">
            {title}
          </h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {value}
            {subText && <span className="text-sm text-gray-500 ml-2">{subText}</span>}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorVariants[color]} bg-opacity-75`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Pie Chart Component for simple visualization
const SimplePieChart = ({ 
  data, 
  title 
}: { 
  data: { name: string, value: number }[], 
  title: string 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center">
              <div 
                className="h-4 w-4 mr-2 rounded-full" 
                style={{ 
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#6366F1', '#F43F5E', '#F59E0B'
                  ][index % 5] 
                }}
              />
              <div className="flex-1 flex justify-between">
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-800">
                  {item.value} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch metrics
        const metricsResponse = await fetch('https://deltapi.website:444/dashboard/metrics/');
        if (!metricsResponse.ok) {
          throw new Error(`Erreur de chargement des métriques: ${metricsResponse.status}`);
        }
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);

        // Fetch payments and commissions
        const paymentsResponse = await fetch('https://deltapi.website:444/dashboard/paiement-commissions-by-month/');
        if (!paymentsResponse.ok) {
          throw new Error(`Erreur de chargement des paiements: ${paymentsResponse.status}`);
        }
        const paymentsData = await paymentsResponse.json();
        setPaymentsData(paymentsData.data);

        // Fetch expenses and bank withdrawals
        const expensesResponse = await fetch('https://deltapi.website:444/dashboard/depenses-sortiebanque-by-months/');
        if (!expensesResponse.ok) {
          throw new Error(`Erreur de chargement des dépenses: ${expensesResponse.status}`);
        }
        const expensesData = await expensesResponse.json();
        setExpensesData(expensesData.data);

        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Error rendering component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-red-500 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Impossible de charger les métriques
        </h2>
        <p className="text-gray-600 mb-4">
          {error || 'Une erreur inattendue est survenue'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  // Loading component
  const LoadingDisplay = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div 
          className="inline-block animate-spin w-12 h-12 border-[4px] border-current border-t-transparent text-blue-600 rounded-full" 
          role="status" 
          aria-label="loading"
        >
          <span className="sr-only">Chargement...</span>
        </div>
        <p className="mt-4 text-gray-600">Chargement des métriques...</p>
      </div>
    </div>
  );

  // If there's an error, show error display
  if (error) {
    return <ErrorDisplay />;
  }

  // If still loading, show loading display
  if (isLoading) {
    return <LoadingDisplay />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Students Metrics */}
        <MetricCard 
          title="Total Étudiants" 
          value={metrics.student_metrics.total_students} 
          icon={Users} 
          color="blue"
          subText={`Nouveaux ce mois: ${metrics.student_metrics.new_students_this_month}`}
        />
        <MetricCard 
          title="Étudiants Masculins" 
          value={metrics.student_metrics.total_male_students} 
          icon={UserCheck} 
          color="green"
        />
        <MetricCard 
          title="Étudiants Féminins" 
          value={metrics.student_metrics.total_female_students} 
          icon={UserX} 
          color="purple"
        />

        {/* Teachers Metrics */}
        <MetricCard 
          title="Total Professeurs" 
          value={metrics.teacher_metrics.total_teachers} 
          icon={Briefcase} 
          color="yellow"
        />
      </div>

      {/* Financial Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payments and Commissions Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Paiements et Commissions</h2>
          <div className="h-[400px]">
          {/*
          <div className='mb-5'>
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={new Date().getFullYear()}
              id="year" name="year" min="1900" max="2100" step="1"
            />
            <button
            type="button"
            onClick={()=>{}}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            submit
          </button>
          </div>
          */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => `${value.toLocaleString()} MAD`}
                />
                <Legend />
                <Bar 
                  dataKey="paiements" 
                  name="Paiements" 
                  fill="#4F46E5" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="commissions" 
                  name="Commissions" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses and Bank Withdrawals Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Dépenses et Sorties Bancaires</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expensesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => `${value.toLocaleString()} MAD`}
                />
                <Legend />
                <Bar 
                  dataKey="depenses" 
                  name="Dépenses" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="sorties-banque" 
                  name="Sorties Bancaires" 
                  fill="#F59E0B" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Teacher Specialties Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Spécialités des Professeurs</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.teacher_metrics.teachers_by_specialite}
                  dataKey="count"
                  nameKey="specialite"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    name
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#4B5563"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-xs"
                      >
                        {name} ({value})
                      </text>
                    );
                  }}
                >
                  {metrics.teacher_metrics.teachers_by_specialite.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[
                        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                        '#6366F1', '#14B8A6', '#F97316', '#EC4899',
                        '#8B5CF6', '#06B6D4', '#F43F5E', '#10B981',
                        '#6366F1', '#14B8A6'
                      ][index % 14]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} professeur${value > 1 ? 's' : ''}`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Statut des Paiements</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.payment_metrics.payment_status}
                  dataKey="count"
                  nameKey="statut_paiement"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    name
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#4B5563"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm font-medium"
                      >
                        {name === 'PARTIAL' ? 'Partiel' : 'Payé'} ({value})
                      </text>
                    );
                  }}
                >
                  <Cell fill="#F59E0B" /> {/* Orange for Partial */}
                  <Cell fill="#10B981" /> {/* Green for Paid */}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} paiement${value > 1 ? 's' : ''}`,
                    name === 'PARTIAL' ? 'Partiel' : 'Payé'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Paiements" 
          value={metrics.payment_metrics.total_payments} 
          icon={CreditCard} 
          color="green"
          subText={`${metrics.payment_metrics.total_amount.toLocaleString()} MAD`}
        />
        <MetricCard 
          title="Total Commissions" 
          value={metrics.commission_metrics.total_commissions} 
          icon={DollarSign} 
          color="purple"
          subText={`${metrics.commission_metrics.total_commission_amount.toLocaleString()} MAD`}
        />
        <MetricCard 
          title="Groupes" 
          value={metrics.group_metrics.total_groups} 
          icon={BookOpen} 
          color="blue"
        />
      </div>

      <div className="mt-4 text-sm text-gray-500 text-right">
        Dernière mise à jour : {new Date(metrics.last_updated).toLocaleString('fr-FR')}
      </div>
    </div>
  );
}

export default Dashboard;
