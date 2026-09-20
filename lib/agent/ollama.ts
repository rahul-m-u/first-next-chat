import { ChatOllama } from "@langchain/ollama";
import { SYSTEM_PROMPT } from "./prompts";

const BASE_URL = process.env.OLLAMA_URL;
const MODEL_NAME = process.env.OLLAMA_MODEL;


const model = new ChatOllama({
    baseUrl: BASE_URL,
    model: MODEL_NAME, // Default value.
    temperature: 0.7,
});


export async function invokeRai(question: string) {

    const updatedPrompt = SYSTEM_PROMPT.replace("{{question}}", question)

    const res = await model.stream(updatedPrompt);

    console.log("response from invokeRai", JSON.stringify(res))

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller: ReadableStreamDefaultController) {
            try {

                for await (const chunk of res) {
                    const content = chunk.content;
                    if (typeof content === "string") {
                        controller.enqueue(encoder.encode(content))
                    }
                }

                controller.close();

            } catch (error) {
                console.log(error)
                controller.error(error);
            }
        }
    })

    return readableStream;

}


