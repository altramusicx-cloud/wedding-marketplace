import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Package,
  Search,
  Filter
} from "lucide-react"
import StatsCard from "@/components/admin/admin-stats-card"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Fetch all products with counts
  const { data: pendingProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      category,
      location,
      status,
      created_at,
      thumbnail_url,
      price_from,
      price_to,
      profiles (full_name, whatsapp_number)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const { count: approvedCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')

  const totalProducts = (pendingProducts?.length || 0) + (approvedCount || 0) + (rejectedCount || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600 mt-1">Approve or reject vendor product submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-5 h-5" />}
          variant="default"
        />
        
        <StatsCard
          title="Pending Review"
          value={pendingProducts?.length || 0}
          change="Awaiting approval"
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
        
        <StatsCard
          title="Approved"
          value={approvedCount || 0}
          change="Active products"
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
        
        <StatsCard
          title="Rejected"
          value={rejectedCount || 0}
          change="Requires revision"
          icon={<XCircle className="w-5 h-5" />}
          variant="danger"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <select className="border rounded-md px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Pending Products ({pendingProducts?.length || 0})
          </CardTitle>
          <p className="text-sm text-gray-600">
            Review and approve vendor product submissions
          </p>
        </CardHeader>
        <CardContent>
          {pendingProducts && pendingProducts.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.thumbnail_url ? (
                            <img
                              src={product.thumbnail_url}
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium truncate max-w-[180px]">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[120px]">
                          {product.profiles?.full_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[120px]">
                          {product.profiles?.whatsapp_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {product.price_from ? (
                          <span>Rp {product.price_from.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {new Date(product.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="h-8 gap-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                          <Button size="sm" variant="destructive" className="h-8 gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending products</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                All vendor submissions have been reviewed. Check back later for new submissions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
