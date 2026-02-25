"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [section, setSection] = useState("class");
  const [text, setText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [language, setLanguage] = useState("English");

  const [classLevel, setClassLevel] = useState("1");
  const [subject, setSubject] = useState("Physics");
  const [mode, setMode] = useState("Theory");

  const [result, setResult] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setText("");
    setFileContent("");
    setResult(null);
    setScore(0);
    setCompleted(false);
  }, [section]);

  const handleLogin = () => {
    if (username.trim() !== "" && password.trim() !== "") {
      setIsLoggedIn(true);
    } else {
      alert("Enter username & password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    const finalText = fileContent || text;

    const formData = new FormData();
    formData.append("section", section);
    formData.append("text", finalText);
    formData.append("language", language);
    formData.append("classLevel", classLevel);
    formData.append("subject", subject);
    formData.append("mode", mode);

    const response = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
    setScore(0);
    setCompleted(false);
  };

  const handleAnswer = (correct: number, selected: number) => {
    if (selected === correct) {
      alert("Correct ✅");
      setScore((prev) => prev + 1);
    } else {
      alert("Wrong ❌");
    }
  };

  const speakText = () => {
    if (!result?.summary) return;
    const speech = new SpeechSynthesisUtterance(result.summary);
    window.speechSynthesis.speak(speech);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 space-y-6">
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Student Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 flex flex-col items-center py-12 px-6">

      <div className="flex justify-between w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold text-indigo-600">
          AI Educational Assistant
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-xl"
        >
          Logout
        </button>
      </div>

      <div className="bg-white/40 p-2 rounded-2xl shadow-lg flex gap-2 mt-6">
        <button
          onClick={() => setSection("class")}
          className={`px-6 py-2 rounded-xl ${section === "class" ? "bg-white shadow" : ""}`}
        >
          Class Section
        </button>
        <button
          onClick={() => setSection("regular")}
          className={`px-6 py-2 rounded-xl ${section === "regular" ? "bg-white shadow" : ""}`}
        >
          Regular AI
        </button>
      </div>

      <div className="bg-white/70 rounded-3xl shadow-xl p-8 w-full max-w-4xl mt-6 space-y-6">

        {section === "class" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="p-3 rounded-xl border">
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>

              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="p-3 rounded-xl border">
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Maths</option>
              </select>

              <select value={mode} onChange={(e) => setMode(e.target.value)} className="p-3 rounded-xl border">
                <option>Theory</option>
                <option>Lab</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Enter Topic"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-xl border mt-4"
            />
          </>
        )}

        {section === "regular" && (
          <>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="w-full border p-3 rounded-xl" />

            <h3 className="text-center font-semibold mt-4">Select Language</h3>

            <div className="flex justify-center gap-4">
              {["English", "Telugu", "Hindi", "Spanish"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-6 py-2 rounded-full border ${
                    language === lang ? "bg-indigo-500 text-white" : "bg-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <textarea
              className="w-full h-40 p-4 rounded-2xl border resize-none mt-4"
              placeholder="Paste content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </>
        )}

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          Generate
        </button>

        {result && (
          <>
            <div className="whitespace-pre-line space-y-2 mt-6">
              {result.summary.split("\n").map((line: string, index: number) => {
                if (line.includes("Summary")) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-indigo-600">
                      {line}
                    </h3>
                  );
                }

                if (line.includes("Key Concepts")) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-purple-600 mt-4">
                      {line}
                    </h3>
                  );
                }

                return (
                  <p key={index} className="text-gray-700">
                    {line}
                  </p>
                );
              })}
            </div>

            <button onClick={speakText} className="px-4 py-2 bg-indigo-200 rounded-xl mt-4">
              🔊 Listen
            </button>

            <h2 className="text-xl font-bold mt-6">Quiz</h2>

            {(result.quiz || []).map((q: any, i: number) => (
              <div key={i}>
                <p>{q.question}</p>
                {q.options.map((opt: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(q.answer, index)}
                    className="block w-full border px-3 py-2 mt-2 rounded"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}

            <button
              onClick={() => setCompleted(true)}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
            >
              Finish Quiz
            </button>

            {completed && (
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold text-green-600 animate-bounce">
                  🎉 Quiz Completed!
                </h3>
                <p>Score: {score}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
