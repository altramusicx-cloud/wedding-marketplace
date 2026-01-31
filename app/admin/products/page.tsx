// File: app/admin/products/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { Eye, Clock, Package, CheckCircle, XCircle } from "lucide-react"
import Link from 'next/link'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // FIXED QUERY: Ambil data dengan join yang benar
  const { data: pendingProducts } = await supabase
    .from('products')
    .select(`
            id,
            name,
            category,
            location,
            status,
            created_at,
            thumbnail_url,
            price_from,
            price_to,
            profiles:vendor_id(full_name, whatsapp_number)
        `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Counts for stats
  const { count: approvedCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')

  const totalPending = pendingProducts?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal">Product Approval</h1>
        <p className="text-gray-600 mt-2">
          Review and approve product submissions from vendors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1">{totalPending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold mt-1">{approvedCount || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold mt-1">{rejectedCount || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold mt-1">
                  {totalPending + (approvedCount || 0) + (rejectedCount || 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Products ({totalPending})
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click "Preview" to review product details
          </p>
        </CardHeader>
        <CardContent>
          {totalPending === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending products</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                All vendor submissions have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProducts?.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Thumbnail */}
                      {product.thumbnail_url ? (
                        <img
                          src={product.thumbnail_url}
                          alt={product.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="mr-4">
                            📍 {product.location}
                          </span>
                          <span>
                            {/* FIXED: profiles adalah array */}
                            👤 {product.profiles?.[0]?.full_name || 'Unknown Vendor'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Applied: {new Date(product.created_at).toLocaleDateString('id-ID')}
                          {product.price_from && (
                            <span className="ml-4">
                              💰 Rp {product.price_from.toLocaleString('id-ID')}
                              {product.price_to && ` - Rp ${product.price_to.toLocaleString('id-ID')}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <Button asChild variant="outline" className="ml-4">
                      <Link href={`/admin/products/preview/${product.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}