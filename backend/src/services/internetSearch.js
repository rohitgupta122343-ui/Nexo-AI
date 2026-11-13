import { tavily as Tavily } from '@tavily/core'

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export async function internetSearch({ query }) {

    console.log("Searching:", query)

    const results = await tavily.search(query, {
        maxResults: 5,
        searchDepth: "basic"
    })

    return JSON.stringify(results)
}