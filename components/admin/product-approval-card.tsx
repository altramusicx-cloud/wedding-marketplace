import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  User, 
  Phone,
  Calendar
} from "lucide-react"
import type { Product } from "@/types"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"

interface ProductApprovalCardProps {
  product: Product
  readonly?: boolean
}

export function ProductApprovalCard({ product, readonly = false }: ProductApprovalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex">
        {/* Product Image */}
        <div className="md:w-1/4 p-4">
          {product.images && product.images.length > 0 ? (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-neutral-100 flex items-center justify-center">
              <div className="text-neutral-400 text-center p-4">
                <div className="text-3xl mb-2">??</div>
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-3/4 p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-neutral-900">
                {formatCurrency(product.price_from || 0)}
                {product.price_to && product.price_to > (product.price_from || 0) ? (
                  <span className="text-neutral-600"> - {formatCurrency(product.price_to)}</span>
                ) : ''}
              </div>
              <div className="text-sm text-neutral-500">
                per {product.price_unit || 'paket'}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-700 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Vendor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium">Vendor:</span>
                <span className="text-sm text-neutral-700">
                  {(product as any).profiles?.[0]?.full_name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium">WhatsApp:</span>
                <span className="text-sm text-neutral-700">
                  {(product as any).profiles?.[0]?.whatsapp_number || '-'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium">Submitted:</span>
                <span className="text-sm text-neutral-700">
                  {formatDate(product.created_at)}
                </span>
              </div>
              <div>
                <Badge 
                  variant="secondary" 
                  className={
                    !product.is_approved ? 'bg-yellow-100 text-yellow-800' :
                    product.is_approved ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!readonly && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              <Button size="sm" variant="destructive" className="gap-2">
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button size="sm" variant="ghost" className="ml-auto">
                View Images ({product.images?.length || 0})
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}



