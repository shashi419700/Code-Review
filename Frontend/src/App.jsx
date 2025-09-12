import { useState, useEffect, useRef } from "react";
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

  const typingRef = useRef(null);
  const isTypingRef = useRef(false);
  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(150); // Mobile-friendly initial height

  useEffect(() => {
    prism.highlightAll();
    document.title = "Shashi Code Reviewer";
    adjustEditorHeight();
  }, []);

  useEffect(() => {
    adjustEditorHeight();
  }, [code]);

  function adjustEditorHeight() {
    const lines = code.split("\n").length;
    const newHeight = Math.min(Math.max(150, lines * 24), 350); // 150-350px for mobile
    setEditorHeight(newHeight);
  }

  async function reviewCode() {
    if (!code.trim()) return;

    setLoading(true);
    setReview("");
    stopTyping();

    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      const fullText = response.data;
      typeWriterEffect(fullText);
    } catch (err) {
      console.log(err);
      setReview("❌ Error while fetching review. Please try again.");
    }
    setLoading(false);
  }

  function typeWriterEffect(text) {
    stopTyping();
    isTypingRef.current = true;
    let i = 0;
    setReview("");

    function typing() {
      if (!isTypingRef.current || !text) return;

      if (i < text.length) {
        setReview((prev) => prev + text.charAt(i));
        i++;
        typingRef.current = setTimeout(typing, 20);
      } else {
        isTypingRef.current = false;
      }
    }

    typing();
  }

  function stopTyping() {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
    isTypingRef.current = false;
  }

  function clearCode() {
    setCode("");
    stopTyping();
    if (!review) setReview("");
  }

  function clearReview() {
    setReview("");
    stopTyping();
  }

  // Responsive font size based on window width
  const editorFontSize = window.innerWidth < 500 ? 14 : 16;

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">💻</span>
          <span className="logo-text">Shashi</span>
        </div>
        <h1>⚡ AI Code Reviewer</h1>
        <div className="actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main>
        <div className="left">
          <div className="toolbar">
            <span>📄 {code.split("\n").length} lines</span>
            <span>✍️ {code.length} chars</span>
            <button className="clear-btn" onClick={clearCode}>
              🗑️ Clear Code
            </button>
          </div>

          <div className="code" style={{ height: editorHeight }}>
            <Editor
              ref={editorRef}
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: editorFontSize,
                height: "100%",
                width: "100%",
                overflow: "auto",
                transition: "height 0.2s ease",
              }}
            />
          </div>

          <div onClick={reviewCode} className="review">
            {loading ? "⏳ Reviewing..." : "🚀 Review Code"}
          </div>
        </div>

        <div className="right">
          <div className="review-header">
            <h2>Review</h2>
            <button className="clear-btn" onClick={clearReview}>
              🗑️ Clear Review
            </button>
          </div>
          <div className="review-box">
            {review ? (
              <pre>{review}</pre>
            ) : (
              "⚡ No review yet, try submitting code!"
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
