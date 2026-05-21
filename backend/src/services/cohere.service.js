import { CohereClientV2 } from "cohere-ai";

export const getCohereModel = () =>
  process.env.COHERE_MODEL || "command-a-plus-05-2026";

let client;

const getClient = () => {
  const token = process.env.COHERE_API_KEY || process.env.CO_API_KEY;

  if (!token) {
    throw new Error("Missing COHERE_API_KEY. Add it to .env.");
  }

  if (!client) {
    client = new CohereClientV2({ token });
  }

  return client;
};

const cleanText = (text = "") => {
  return text
    // remove markdown
    .replace(/\*\*/g, "")
    .replace(/#{1,6}/g, "")
    .replace(/`{3,}/g, "")
    .replace(/-{3,}/g, "")
    .replace(/\. /g, ".\n\n")
    .replace(/\. /g, ".\n\n")
    // remove excessive new lines
    .replace(/\n{3,}/g, "\n\n")

    // remove spaces
    .trim();
};

export const extractText = (response) => {
  const content = response?.message?.content;

  // Most common case
  if (Array.isArray(content)) {
    const text = content
      .filter((item) => {
        // ONLY KEEP REAL TEXT
        return (
          item?.type === "text" ||
          item?.type === "output_text"
        );
      })
      .map((item) => item.text || "")
      .join("\n")
      .trim();

    return cleanText(text);
  }

  // fallback
  if (typeof content === "string") {
    return cleanText(content);
  }

  return "";
};

export const chatWithCohere = async ({
  messages,
  responseFormat,
  maxTokens = 180,
  temperature = 0.4,
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
