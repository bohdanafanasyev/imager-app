// Constants for CO₂ emissions per GB of storage and per GB of data transfer
const CO2_EMISSIONS_STORAGE_PER_GB_PER_YEAR = 0.4 // kg CO₂ per GB per year
const CO2_EMISSIONS_TRANSFER_PER_GB = 0.2 // kg CO₂ per GB of data transfer

export function formatCO2Emissions(kg: number): string {
    if (kg < 1) {
        const grams = kg * 1000 // Convert kg to grams
        return `${grams.toFixed(2)} g` // Return as grams with two decimals
    }
    return `${kg.toFixed(2)} kg` // Return as kg if >= 1 kg
}

// Calculate the CO₂ emissions for the original and optimised images in kg
export function calculateCO2Emissions(
    originalTotalSizeBytes: number,
    optimisedTotalSizeBytes: number
): { original: number, optimised: number, reduction: number } {
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
    const original = originalStorageEmissions + originalTransferEmissions
    const optimised = optimisedStorageEmissions + optimisedTransferEmissions

    // Calculate the reduction in CO₂ emissions
    const reduction = original - optimised

    return {
        original,
        optimised,
        reduction
    }
}
