// File: app/admin/products/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductApprovalCard } from '@/components/admin/product-approval-card'
import { createClient } from '@/lib/supabase/server'
import type { ProductWithImages } from '@/types'

export default async function AdminProductsPage() {
    const supabase = await createClient()

    // Fetch pending products with images
    const { data: pendingProducts } = await supabase
        .from('products')
        .select(`
      *,
      product_images(*),
      profiles:vendor_id(full_name, whatsapp_number)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    // Fetch recently approved/rejected
    const { data: recentProducts } = await supabase
        .from('products')
        .select(`
      *,
      product_images(*),
      profiles:vendor_id(full_name, whatsapp_number)
    `)
        .in('status', ['approved', 'rejected'])
        .order('updated_at', { ascending: false })
        .limit(20)

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {pendingProducts?.length || 0}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Products waiting for approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Approved This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Products approved recently
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Average Response Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">24h</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Time to review submissions
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="pending" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="pending">
                        Pending ({pendingProducts?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="recent">
                        Recently Reviewed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingProducts?.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-gray-500">No products pending approval</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pendingProducts?.map((product) => (
                                <ProductApprovalCard
                                    key={product.id}
                                    product={product as ProductWithImages}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="recent" className="space-y-4">
                    {recentProducts?.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-gray-500">No recently reviewed products</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {recentProducts?.map((product) => (
                                <ProductApprovalCard
                                    key={product.id}
                                    product={product as ProductWithImages}
                                    readonly
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}