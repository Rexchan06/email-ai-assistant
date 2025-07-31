const API_BASE = import.meta.env.VITE_API_BASE_URL

export const getGoogleAuthUrl = async () => {
    const response = await fetch(`${API_BASE}/api/auth/google`)
    if (!response.ok) throw new Error('Failed to get Google auth URL')
    return await response.json()
}

export const logout = async (token) => {
    const response = await fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
    if (!response.ok) throw new Error('Logout failed')
    return await response.json()
}

export const processEmails = async ({ daysOld, category, confidence, token }) => {
    try {
        const response = await fetch(`${API_BASE}/api/process-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                daysOld,
                category,
                confidenceThreshold: confidence
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `HTTP ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}