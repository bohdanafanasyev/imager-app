import { roundToTwoDecimals } from '~/utils/format'
import type { ImageStatisticsData } from '~/types'

const CO2_EMISSIONS_STORAGE_PER_GB_PER_YEAR = 0.4 // kg CO₂ per GB per year
const CO2_EMISSIONS_TRANSFER_PER_GB = 0.2 // kg CO₂ per GB of data transfer

export function formatCO2Emissions(grams: number): string {
    if (grams < 1000) {
        return `${grams.toFixed(2)} g` // Return as grams with two decimals
    }
    const kg = grams / 1000 // Convert grams to kg
    return `${kg.toFixed(2)} kg` // Return as kg if >= 1000 grams
}

// Calculate the CO₂ emissions for the original and optimised images in grams
export function calculateCO2Emissions(
    originalTotalSizeBytes: number,
    optimisedTotalSizeBytes: number
): ImageStatisticsData {
    // Average number of views per month
    const viewsPerMonth = 1.5
    // Convert total sizes from bytes to GB
    const originalTotalSizeGB = originalTotalSizeBytes / (1024 ** 3)
    const optimisedTotalSizeGB = optimisedTotalSizeBytes / (1024 ** 3)

    // Calculate storage emissions for one year
    const originalStorageEmissions = originalTotalSizeGB * CO2_EMISSIONS_STORAGE_PER_GB_PER_YEAR
    const optimisedStorageEmissions = optimisedTotalSizeGB * CO2_EMISSIONS_STORAGE_PER_GB_PER_YEAR

    // Calculate annual data transfer emissions for original and optimised images
    const originalAnnualTransferGB = originalTotalSizeGB * viewsPerMonth * 12
    const optimisedAnnualTransferGB = optimisedTotalSizeGB * viewsPerMonth * 12

    const originalTransferEmissions = originalAnnualTransferGB * CO2_EMISSIONS_TRANSFER_PER_GB
    const optimisedTransferEmissions = optimisedAnnualTransferGB * CO2_EMISSIONS_TRANSFER_PER_GB

    // Total emissions for original and optimised images over one year
    const original = (originalStorageEmissions + originalTransferEmissions) * 1000 // Convert to grams
    const optimised = (optimisedStorageEmissions + optimisedTransferEmissions) * 1000 // Convert to grams

    // Calculate the saved in CO₂ emissions
    const saved = original - optimised

    return {
        original: roundToTwoDecimals(original),
        optimised: roundToTwoDecimals(optimised),
        saved: roundToTwoDecimals(saved),
        savedPercentage: roundToTwoDecimals((saved / original) * 100)
    }
}
