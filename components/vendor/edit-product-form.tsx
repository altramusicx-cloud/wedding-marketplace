// components/vendor/edit-product-form.tsx - Simplified
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface EditProductFormProps {
  productId: string
  initialData?: {
    name: string
    description?: string
    priceFrom?: number
    priceTo?: number
  }
  onSuccess?: () => void
}

export function EditProductForm({ 
  productId, 
  initialData, 
  onSuccess 
}: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    priceFrom: initialData?.priceFrom?.toString() || "",
    priceTo: initialData?.priceTo?.toString() || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert(`Product ${productId} updated! (Simulation)`)
      onSuccess?.()
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceFrom">Price From</Label>
          <Input
            id="priceFrom"
            name="priceFrom"
            value={formData.priceFrom}
            onChange={handleChange}
            type="number"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceTo">Price To</Label>
          <Input
            id="priceTo"
            name="priceTo"
            value={formData.priceTo}
            onChange={handleChange}
            type="number"
            placeholder="0"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
