// Grading Engine - Calculates personalized product grades based on skin profile

interface SkinProfile {
    type?: string // Oily, Dry, Combination, Normal
    sensitivity?: string // Sensitive, Resistant
    concerns?: string[] // Acne, Texture, Hyperpigmentation, etc.
    pigmentation?: string // Pigmented, Non-Pigmented
}

interface GlobalSuitability {
    [key: string]: {
        score: number
        reason: string
    }
}

type Grade = "A" | "B" | "C" | "D" | "F" | "?"

/**
 * Calculate a personalized grade for a product based on user's skin profile
 */
export function calculateGrade(
    globalSuitability: GlobalSuitability | null,
    skinProfile: SkinProfile | null
): { grade: Grade; reason: string } {
    // No skin profile = can't grade
    if (!skinProfile || !skinProfile.type) {
        return { grade: "?", reason: "Complete your skin profile to get personalized grades" }
    }

    // No grading data for this product
    if (!globalSuitability) {
        return { grade: "?", reason: "Grading data not available for this product" }
    }

    // Build the key for lookup (e.g., "oily_sensitive", "dry_resistant")
    const typeKey = skinProfile.type.toLowerCase()
    const sensitivityKey = skinProfile.sensitivity?.toLowerCase() || "resistant"
    const lookupKey = `${typeKey}_${sensitivityKey}`
    const altLookupKey = typeKey // Fallback to just type

    // Look up the score
    const suitabilityData = globalSuitability[lookupKey] || globalSuitability[altLookupKey]

    if (!suitabilityData) {
        return { grade: "?", reason: "No data for your skin profile yet" }
    }

    const score = suitabilityData.score
    const reason = suitabilityData.reason || "Based on ingredient analysis"

    // Convert score (0-100) to grade
    let grade: Grade
    if (score >= 90) {
        grade = "A"
    } else if (score >= 75) {
        grade = "B"
    } else if (score >= 60) {
        grade = "C"
    } else if (score >= 40) {
        grade = "D"
    } else {
        grade = "F"
    }

    return { grade, reason }
}

/**
 * Get grade color for UI display
 */
export function getGradeColor(grade: Grade): string {
    switch (grade) {
        case "A":
            return "bg-green-500"
        case "B":
            return "bg-green-400"
        case "C":
            return "bg-yellow-500"
        case "D":
            return "bg-orange-500"
        case "F":
            return "bg-red-500"
        default:
            return "bg-gray-400"
    }
}

/**
 * Get grade description
 */
export function getGradeDescription(grade: Grade): string {
    switch (grade) {
        case "A":
            return "Excellent match for your skin"
        case "B":
            return "Good match for your skin"
        case "C":
            return "Neutral - use with caution"
        case "D":
            return "May not be suitable"
        case "F":
            return "Not recommended for your skin"
        default:
            return "Unknown compatibility"
    }
}
