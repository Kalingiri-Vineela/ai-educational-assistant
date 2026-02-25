export const runtime = "nodejs";

import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

// Basic Smart Summarizer
function summarizeText(text: string) {
  const sentences = text.split(". ");
  const summary = sentences.slice(0, 4).join(". ") + ".";

  const words = text
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .filter((w) => w.length > 6);

  const unique = [...new Set(words)].slice(0, 5);

  return {
    summary,
    keyPoints: unique,
  };
}

function generateTopicInfo(topic: string, subject: string) {
  if (subject === "Maths") {
    try {
      const result = eval(topic);
      return `🧮 Calculation Result:\n${topic} = ${result}`;
    } catch {
      return "Invalid mathematical expression.";
    }
  }

  if (subject === "Physics") {
    return `🔬 Physics Topic: ${topic}

Physics explains natural phenomena related to ${topic}.`;
  }

  if (subject === "Chemistry") {
    return `⚗ Chemistry Topic: ${topic}

Chemistry studies reactions and properties related to ${topic}.`;
  }

  return topic;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const section = formData.get("section") as string;
    const text = formData.get("text") as string;
    const language = formData.get("language") as string;
    const subject = formData.get("subject") as string;

    let finalText = "";

    if (section === "class") {
      finalText = generateTopicInfo(text, subject);
    } else {
      const processed = summarizeText(text);

      finalText = `📘 Summary:\n${processed.summary}

📌 Key Concepts:
${processed.keyPoints.map((k) => "• " + k).join("\n")}`;
    }

    // Translation
    if (language && language !== "English") {
      let target = "en";
      if (language === "Telugu") target = "te";
      if (language === "Hindi") target = "hi";
      if (language === "Spanish") target = "es";

      try {
        const translated = await translate(finalText, { to: target });
        finalText = translated.text;
      } catch {}
    }

    const quiz = [
      {
        question: "What is the main idea?",
        options: ["Concept", "Definition", "Example", "Process"],
        answer: 0,
      },
      {
        question: "Is this topic important?",
        options: ["Yes", "No"],
        answer: 0,
      },
    ];

    return NextResponse.json({
      summary: finalText,
      quiz,
    });

  } catch {
    return NextResponse.json({
      summary: "Processing failed.",
      quiz: [],
    });
  }
}
