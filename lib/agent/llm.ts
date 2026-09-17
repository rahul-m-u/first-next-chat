
const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;



export async function chatWithAI(messages: { role: string, content: string }[]) {
    if (!OLLAMA_URL || !OLLAMA_MODEL) {
        throw new Error("OLLAMA_URL or OLLAMA_MODEL not defined");
    }

    console.log("OLLAMA_URL : ", OLLAMA_URL)
    console.log("OLLAMA_MODEL : ", OLLAMA_MODEL)

    const res = await fetch(`${OLLAMA_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: messages,
            stream: false
        }),
    });

    if (!res.ok) {
        throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.message || !data.message.content) {
        throw new Error("Invalid response format from Ollama API");
    }

    return data.message.content;
}