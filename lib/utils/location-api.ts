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

// API Configuration
const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api"
const CACHE_DURATION = 86400 // 24 hours

// Generic fetch function
async function fetchAPI<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        next: { revalidate: CACHE_DURATION }
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
}

// Get ALL Kalimantan provinces (ID: 62, 63, 64, 65, 66)
export const getKalimantanProvinces = cache(async (): Promise<Province[]> => {
    try {
        const allProvinces: any[] = await fetchAPI(`${API_BASE}/provinces.json`)

        // Filter hanya provinsi Kalimantan
        return allProvinces
            .filter(province => ['62', '63', '64', '65', '66'].includes(province.id))
            .map(province => ({
                id: province.id,
                name: province.name
            }))
    } catch (error) {
        console.error('Error fetching provinces:', error)
        throw error // Biar UI handle error
    }
})

// Get regencies/kota by province ID
export const getRegenciesByProvince = cache(async (provinceId: string): Promise<Regency[]> => {
    try {
        const regencies: any[] = await fetchAPI(`${API_BASE}/regencies/${provinceId}.json`)

        return regencies.map(regency => ({
            id: regency.id,
            name: regency.name,
            province_id: provinceId
        }))
    } catch (error) {
        console.error(`Error fetching regencies for province ${provinceId}:`, error)
        throw error
    }
})

// Get districts by regency ID
export const getDistrictsByRegency = cache(async (regencyId: string): Promise<District[]> => {
    try {
        const districts: any[] = await fetchAPI(`${API_BASE}/districts/${regencyId}.json`)

        return districts.map(district => ({
            id: district.id,
            name: district.name,
            regency_id: regencyId
        }))
    } catch (error) {
        console.error(`Error fetching districts for regency ${regencyId}:`, error)
        throw error
    }
})