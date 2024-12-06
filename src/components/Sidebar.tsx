import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  GitBranch,
  BookOpen,
  UsersRound,
  Wallet,
  PiggyBank,
  Receipt,
  Building,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/students', icon: Users, label: 'Students' },
  { path: '/teachers', icon: GraduationCap, label: 'Teachers' },
  { path: '/levels', icon: Layers, label: 'Levels' },
  { path: '/branches', icon: GitBranch, label: 'Branches' },
  { path: '/subjects', icon: BookOpen, label: 'Subjects' },
  { path: '/groups', icon: UsersRound, label: 'Groups' },
  { path: '/payments', icon: Wallet, label: 'Payments' },
  { path: '/commissions', icon: PiggyBank, label: 'Commissions' },
  { path: '/expenses', icon: Receipt, label: 'Dépenses' },
  { path: '/bank-withdrawals', icon: Building, label: 'Sorties Banque' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Delta Institut</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;