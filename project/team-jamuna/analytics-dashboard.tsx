import React, { useState } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, MessageCircle, Users, AlertTriangle, Zap, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample data - would come from API in production
  const usageData = [
    { date: '2024-01-01', messages: 1200, users: 450, success: 1150, failed: 50 },
    { date: '2024-01-02', messages: 1500, users: 480, success: 1450, failed: 50 },
    { date: '2024-01-03', messages: 1300, users: 510, success: 1250, failed: 50 },
    { date: '2024-01-04', messages: 1800, users: 550, success: 1700, failed: 100 },
    { date: '2024-01-05', messages: 2000, users: 600, success: 1900, failed: 100 },
    { date: '2024-01-06', messages: 1700, users: 620, success: 1650, failed: 50 },
    { date: '2024-01-07', messages: 1900, users: 650, success: 1850, failed: 50 },
  ];

  const responseTypes = [
    { name: 'Quick Replies', value: 45 },
    { name: 'Text Responses', value: 30 },
    { name: 'Rich Media', value: 15 },
    { name: 'Actions', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,400</div>
            <p className="text-xs text-gray-500">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">650</div>
            <p className="text-xs text-gray-500">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-gray-500">+1.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Usage</CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.4%</div>
            <p className="text-xs text-gray-500">of monthly limit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={usageData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#0088FE" />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Types</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={responseTypes}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {responseTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
