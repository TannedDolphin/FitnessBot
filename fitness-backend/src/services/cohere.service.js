import { CohereClientV2 } from "cohere-ai";

export const getCohereModel = () =>
  process.env.COHERE_MODEL || "command-a-plus-05-2026";

let client;

const getClient = () => {
  const token = process.env.COHERE_API_KEY || process.env.CO_API_KEY;

  if (!token) {
    throw new Error("Missing COHERE_API_KEY. Add it to fitness-backend/.env.");
  }

  if (!client) {
    client = new CohereClientV2({ token });
  }

  return client;
};

export const extractText = (response) => {
  const content = response?.message?.content;

  if (Array.isArray(content)) {
    return content
      .filter((item) => item?.type === "text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("")
      .trim();
  }

  if (typeof content === "string") {
    return content.trim();
  }

  if (typeof content === "object" && content !== null) {
    return JSON.stringify(content).trim();
  }

  return "";
};

export const chatWithCohere = async ({
  messages,
  responseFormat,
  maxTokens = 1200,
  temperature = 0.35,
}) => {
  const model = getCohereModel();
  const response = await getClient().chat({
    model,
    messages,
    responseFormat,
    maxTokens,
    temperature,
    safetyMode: "CONTEXTUAL",
  });

  return {
    model,
    text: extractText(response),
    finishReason: response.finishReason,
    usage: response.usage,
  };
};
