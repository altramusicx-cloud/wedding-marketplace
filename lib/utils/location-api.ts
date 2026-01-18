// File: lib/utils/location-api.ts
import { cache } from 'react'

// Types
export interface Province {
    id: string
    name: string
}

export interface Regency {
    id: string
    name: string
    province_id: string
}

export interface District {
    id: string
    name: string
    regency_id: string
}

// Static data - no API calls
export const getKalimantanProvinces = cache(async (): Promise<Province[]> => {
    return [
        { id: '62', name: 'Kalimantan Barat' },
        { id: '63', name: 'Kalimantan Selatan' },
        { id: '64', name: 'Kalimantan Tengah' },
        { id: '65', name: 'Kalimantan Timur' },
        { id: '66', name: 'Kalimantan Utara' }, // Different ID to avoid duplicate
    ]
})

export const getRegenciesByProvince = cache(async (provinceId: string): Promise<Regency[]> => {
    const data: Record<string, Regency[]> = {
        '62': [ // Kalimantan Barat
            { id: '6271', name: 'Kota Pontianak', province_id: '62' },
            { id: '6272', name: 'Kota Singkawang', province_id: '62' },
        ],
        '63': [ // Kalimantan Selatan
            { id: '6371', name: 'Kota Banjarmasin', province_id: '63' },
            { id: '6372', name: 'Kota Banjarbaru', province_id: '63' },
        ],
        '64': [ // Kalimantan Tengah
            { id: '6471', name: 'Kota Palangka Raya', province_id: '64' },
        ],
        '65': [ // Kalimantan Timur
            { id: '6571', name: 'Kota Samarinda', province_id: '65' },
            { id: '6572', name: 'Kota Balikpapan', province_id: '65' },
        ],
        '66': [ // Kalimantan Utara
            { id: '6671', name: 'Kota Tarakan', province_id: '66' },
        ]
    }
    return data[provinceId] || []
})

export const getDistrictsByRegency = cache(async (regencyId: string): Promise<District[]> => {
    const data: Record<string, District[]> = {
        '6271': [ // Kota Pontianak
            { id: '6271010', name: 'Pontianak Kota', regency_id: '6271' },
            { id: '6271011', name: 'Pontianak Selatan', regency_id: '6271' },
        ],
        '6371': [ // Kota Banjarmasin
            { id: '6371010', name: 'Banjarmasin Selatan', regency_id: '6371' },
            { id: '6371020', name: 'Banjarmasin Timur', regency_id: '6371' },
        ],
        '6372': [ // Kota Banjarbaru
            { id: '6372010', name: 'Banjarbaru Selatan', regency_id: '6372' },
            { id: '6372020', name: 'Banjarbaru Utara', regency_id: '6372' },
        ]
    }
    return data[regencyId] || []
})