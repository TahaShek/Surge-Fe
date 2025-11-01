import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { TabsContainer } from "@/components/ui/tabs/TabsContainer";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart2,
  PieChart
} from 'lucide-react';

// Dummy data
const revenueData = [
  { month: 'Jan', value: 2400 },
  { month: 'Feb', value: 1398 },
  { month: 'Mar', value: 9800 },
  { month: 'Apr', value: 3908 },
  { month: 'May', value: 4800 },
  { month: 'Jun', value: 3800 },
];

const usersData = [
  { month: 'Jan', active: 4000, new: 2400 },
  { month: 'Feb', active: 3000, new: 1398 },
  { month: 'Mar', active: 2000, new: 9800 },
  { month: 'Apr', active: 2780, new: 3908 },
  { month: 'May', active: 1890, new: 4800 },
  { month: 'Jun', active: 2390, new: 3800 },
];

const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
          <Icon className={`w-5 h-5 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        </div>
      </div>
      <div className="flex items-center mt-4 space-x-2">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
        )}
        <span className={`text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
    </Card>
  </motion.div>
);

export default function DashboardPage() {
  const stats = [
    { title: 'Total Revenue', value: '$12,345', change: '+12.3%', icon: DollarSign, trend: 'up' },
    { title: 'Active Users', value: '1,234', change: '+5.7%', icon: Users, trend: 'up' },
    { title: 'Sales', value: '456', change: '-2.1%', icon: ShoppingCart, trend: 'down' },
    { title: 'Conversion Rate', value: '2.3%', change: '+1.2%', icon: TrendingUp, trend: 'up' },
  ];

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <Activity className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Users Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="hsl(var(--primary))" />
                  <Bar dataKey="new" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: 'revenue',
      label: 'Revenue',
      icon: <BarChart2 className="w-4 h-4" />,
      content: <div>Revenue content...</div>,
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <PieChart className="w-4 h-4" />,
      content: <div>Analytics content...</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your dashboard</p>
        </div>
      </div>

      <TabsContainer 
        tabs={tabs}
        variant="modern"
      />
    </div>
  );
}
