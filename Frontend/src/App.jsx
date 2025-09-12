import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview(""); // पुराना review clear
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });

      const fullText = response.data;
      typeWriterEffect(fullText); // ✅ typewriter effect
    } catch (err) {
      console.log(err)
      setReview("❌ Error while fetching review. Please try again.");
    }
    setLoading(false);
  }

  // ✅ ChatGPT style fast typewriter
  function typeWriterEffect(text) {
    let i = 0;
    setReview(""); 
    const speed = 20; // typing speed (ms)
    function typing() {
      if (i < text.length) {
        setReview((prev) => prev + text.charAt(i));
        i++;
        setTimeout(typing, speed);
      }
    }
    typing();
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <header>
        <h1>⚡ AI Code Reviewer</h1>
        <div className="actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main>
        {/* LEFT PANEL */}
        <div className="left">
          <div className="toolbar">
            <span>📄 {code.split("\n").length} lines</span>
            <span>✍️ {code.length} chars</span>
            <button className="clear-btn" onClick={() => setCode("")}>
              🗑️ Clear Code
            </button>
          </div>

          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
              }}
            />
          </div>

          <div onClick={reviewCode} className="review">
            {loading ? "⏳ Reviewing..." : "🚀 Review Code"}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="review-header">
            <h2>Review</h2>
            <button className="clear-btn" onClick={() => setReview("")}>
              🗑️ Clear Review
            </button>
          </div>
          <div className="review-box">
            {review ? <pre>{review}</pre> : "⚡ No review yet, try submitting code!"}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
