import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import "./index.css";

function App() {
  const [code, setCode] = useState(`function sumArray(arr) {
  let sum  0;
  for (let num of arr) {
    sum += num;

`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://code-review-9.onrender.com";

  async function reviewCode() {
    if (!code.trim()) return;
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post(`${API_URL}/ai/get-review`, { code });
      typeWriterEffect(response.data);
    } catch (err) {
      console.log(err);
      setReview("❌ Error while fetching review. Please try again.");
    }
    setLoading(false);
  }

  function typeWriterEffect(text) {
    let i = 0;
    setReview("");
    const speed = 15;
    function typing() {
      if (i < text.length) {
        setReview((prev) => prev + text.charAt(i));
        i++;
        setTimeout(typing, speed);
      }
    }
    typing();
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  function downloadReview() {
    const blob = new Blob([review], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-review.txt";
    a.click();
  }

  return (
    <div
      className={
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 min-h-screen flex flex-col"
          : "bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900 min-h-screen flex flex-col"
      }
    >
      {/* HEADER */}
      <header className="flex flex-wrap justify-between items-center p-4 md:p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl backdrop-blur-md z-10">
        <div className="flex items-center gap-2 font-bold text-2xl md:text-3xl">
          <span>💻 Shashi</span>
        </div>
        <h1 className="text-lg md:text-2xl font-semibold tracking-wide">
          ⚡ AI Code Reviewer
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md font-semibold hover:bg-white/40 transition-all shadow-md hover:shadow-xl active:scale-90"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-6 p-4 md:p-6 flex-1">
        {/* LEFT PANEL */}
        <div
          className={
            darkMode
              ? "flex-1 flex flex-col bg-gray-900/70 p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.01]"
              : "flex-1 flex flex-col bg-white/70 p-6 rounded-2xl shadow-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:scale-[1.01]"
          }
        >
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center mb-4 text-gray-500 dark:text-gray-300 gap-2">
            <div className="flex gap-3">
              <span
                className={
                  darkMode
                    ? "bg-indigo-500/30 px-3 py-1 rounded-lg font-medium text-indigo-700 dark:text-white"
                    : "bg-gray-800 px-3 py-1 rounded-lg font-medium text-white"
                }
              >
                📄 {code.split("\n").length} lines
              </span>
              <span
                className={
                  darkMode
                    ? "bg-green-500/30 px-3 py-1 rounded-lg font-medium text-green-700 dark:text-white"
                    : "bg-gray-800 px-3 py-1 rounded-lg font-medium text-white"
                }
              >
                ✍️ {code.length} chars
              </span>
            </div>

            {/* Stylish Language Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={
                  darkMode
                    ? "appearance-none px-4 py-3 rounded-xl bg-gray-800 text-white font-semibold border border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition-all cursor-pointer"
                    : "appearance-none px-4 py-3 rounded-xl bg-white text-black font-semibold border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition-all cursor-pointer"
                }
              >
                <option
                  disabled
                  className={darkMode ? "text-gray-400" : "text-gray-400"}
                >
                  🔽 Select Language
                </option>
                <option value="javascript">🟨 JavaScript</option>
                <option value="typescript">🔵 TypeScript</option>
                <option value="python">🐍 Python</option>
                <option value="cpp">💠 C++</option>
                <option value="c">⚙️ C</option>
                <option value="java">☕ Java</option>
                <option value="csharp">#️⃣ C#</option>
                <option value="go">🌀 Go</option>
                <option value="ruby">💎 Ruby</option>
                <option value="php">🌐 PHP</option>
                <option value="swift">🦅 Swift</option>
                <option value="kotlin">🟣 Kotlin</option>
                <option value="rust">🦀 Rust</option>
              </select>
              {/* Dropdown Arrow */}
              <span
                className={
                  darkMode
                    ? "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    : "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                }
              >
                ▼
              </span>
            </div>
          </div>

          {/* Code Editor */}
          <div
            className={
              darkMode
                ? "flex-1 overflow-auto rounded-xl shadow-inner bg-gray-800/70 p-4 mb-4 backdrop-blur-sm border border-white/10"
                : "flex-1 overflow-auto rounded-xl shadow-inner bg-white/70 p-4 mb-4 backdrop-blur-sm border border-gray-300"
            }
          >
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(
                  code,
                  prism.languages[language] || prism.languages.javascript,
                  language
                )
              }
              padding={10}
              style={{ fontFamily: '"Fira Code", monospace', fontSize: 16 }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between flex-wrap gap-2">
            <button
              onClick={() => setCode("")}
              className={
                darkMode
                  ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-md transform hover:scale-105 active:scale-90"
                  : "px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all shadow-md transform hover:scale-105 active:scale-90"
              }
            >
              🗑️ Clear
            </button>
            <button
              onClick={reviewCode}
              className={
                darkMode
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-90 transition-all hover:shadow-2xl"
                  : "bg-gray-800 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-90 transition-all hover:shadow-2xl"
              }
            >
              {loading ? "⏳ Reviewing..." : "🚀 Review Code"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={
            darkMode
              ? "flex-1 flex flex-col bg-gray-800/70 p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 hover:border-purple-500/40 transition-all hover:scale-[1.01]"
              : "flex-1 flex flex-col bg-white/70 p-6 rounded-2xl shadow-xl border border-gray-200 hover:border-purple-300 transition-all hover:scale-[1.01]"
          }
        >
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-semibold tracking-wide">Review</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => copyToClipboard(review)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-90"
              >
                📋 Copy
              </button>
              <button
                onClick={downloadReview}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-90"
              >
                ⬇️ Save
              </button>
              <button
                onClick={() => {
                  setLoading(false);
                  setReview("");
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-90"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Review Output */}
          <div
            className={`flex-1 overflow-auto transition-opacity duration-300 ${
              review === "" ? "opacity-0" : "opacity-100"
            }`}
          >
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-full"></div>
              </div>
            ) : review ? (
              <pre className="whitespace-pre-wrap break-words font-mono">
                {review}
              </pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                ⚡ No review yet, try submitting code!
              </p>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-transparent">
        Made with ❤️ by Shashi | Powered by AI ⚡
      </footer>
    </div>
  );
}

export default App;
