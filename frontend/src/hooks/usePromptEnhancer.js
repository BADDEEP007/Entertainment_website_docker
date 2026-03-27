const DIRECTOR_API_URL = import.meta.env.VITE_DIRECTOR_API_URL ?? "http://localhost:5000/get_prompt"

/**
 * Calls the director enhancement API with the user's prompt.
 * Returns the director's upgraded version of the prompt.
 */
export async function enhancePrompt(userPrompt) {
    const response = await fetch(DIRECTOR_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
    })

    if (!response.ok) throw new Error(`Director API error: ${response.status}`)

    const data = await response.json()
    return data.detailed_prompt.trim() ?? ""
}
