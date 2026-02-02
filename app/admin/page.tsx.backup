// app/admin/page.tsx - UI ONLY VERSION
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Users,
  Package,
  TrendingUp,
  DollarSign
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboardPage() {
  // Static data for UI
  const stats = [
    { title: "Pending Approval", value: "12", change: "+2 new", icon: Clock, variant: "warning" },
    { title: "Active Vendors", value: "148", change: "+5 this week", icon: Users, variant: "success" },
    { title: "Today's Contacts", value: "42", change: "+12% from yesterday", icon: MessageSquare, variant: "primary" },
    { title: "Revenue (Est.)", value: "Rp 8.2M", change: "+18.5%", icon: DollarSign, variant: "default" },
  ]

  const pendingProducts = [
    { id: 1, name: "Bakso Mas Budi", category: "Food & Beverage", vendor: "Budi Santoso", date: "Jun 15, 2023" },
    { id: 2, name: "Toko Elektronik Maju", category: "Retail", vendor: "Sari Wijaya", date: "Jun 14, 2023" },
    { id: 3, name: "Wedding Photography", category: "Photography", vendor: "Andi Pratama", date: "Jun 12, 2023" },
    { id: 4, name: "Venue Grand Ballroom", category: "Venue", vendor: "PT Wedding Organizer", date: "Jun 10, 2023" },
  ]

  const recentActivities = [
    { user: 'Budi Santoso', action: 'registered as vendor', time: '10 min ago' },
    { user: 'Sari Wijaya', action: 'submitted new product', time: '25 min ago' },
    { user: 'PT Wedding Organizer', action: 'contacted 3 vendors', time: '1 hour ago' },
    { user: 'Admin', action: 'approved 5 products', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-l-4 ${
            stat.variant === 'warning' ? 'border-yellow-500' :
            stat.variant === 'success' ? 'border-green-500' :
            stat.variant === 'primary' ? 'border-blue-500' : 'border-gray-500'
          }`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-xs font-medium mt-1 ${
                    stat.variant === 'warning' ? 'text-yellow-700' :
                    stat.variant === 'success' ? 'text-green-700' :
                    stat.variant === 'primary' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  stat.variant === 'warning' ? 'bg-yellow-50' :
                  stat.variant === 'success' ? 'bg-green-50' :
                  stat.variant === 'primary' ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.variant === 'warning' ? 'text-yellow-700' :
                    stat.variant === 'success' ? 'text-green-700' :
                    stat.variant === 'primary' ? 'text-blue-700' : 'text-gray-700'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Products Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Products</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {pendingProducts.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[180px]">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{product.vendor}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {product.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="h-7 text-xs">Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/admin/products">View All Products</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <p className="text-sm text-gray-600">Common administrative tasks</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/products">
                <Package className="w-4 h-4 mr-2" />
                Review Products
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/vendors">
                <Users className="w-4 h-4 mr-2" />
                Manage Vendors
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/logs">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Contact Logs
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-gray-600">Latest platform activities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-600 ml-2">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
