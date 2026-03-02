
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const analyticsData = [
  { name: 'Monday', visitors: 1200, pageViews: 3400 },
  { name: 'Tuesday', visitors: 1900, pageViews: 4200 },
  { name: 'Wednesday', visitors: 800, pageViews: 2100 },
  { name: 'Thursday', visitors: 1500, pageViews: 3800 },
  { name: 'Friday', visitors: 2000, pageViews: 5200 },
  { name: 'Saturday', visitors: 1700, pageViews: 4100 },
  { name: 'Sunday', visitors: 1300, pageViews: 3200 },
]

const deviceData = [
  { name: 'Desktop', value: 65, color: '#3b82f6' },
  { name: 'Mobile', value: 30, color: '#ef4444' },
  { name: 'Tablet', value: 5, color: '#10b981' },
]

export default function Analytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track your application's performance and user engagement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-primary-600">12,847</p>
          <p className="text-sm text-green-600 mt-1">↗ 8.2% from last week</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Page Views</h3>
          <p className="text-3xl font-bold text-primary-600">45,923</p>
          <p className="text-sm text-green-600 mt-1">↗ 12.5% from last week</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold text-primary-600">34.2%</p>
          <p className="text-sm text-red-600 mt-1">↘ 2.1% from last week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
              <Bar dataKey="pageViews" fill="#10b981" name="Page Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Usage</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
