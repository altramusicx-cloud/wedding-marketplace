// File: lib/validation/category-schema.ts
import { z } from 'zod'

export const categorySearchSchema = z.object({
    search: z.string().min(2).max(100).optional(),
    category: z.enum([
        'venue', 'photographer', 'catering', 'decoration',
        'dress', 'makeup', 'music', 'invitation'
    ]).optional(),
    sort: z.enum(['newest', 'featured', 'price_low', 'price_high']).default('newest'),
    page: z.coerce.number().min(1).default(1)
})

export type CategorySearchParams = z.infer<typeof categorySearchSchema>