import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import "./App.css";

function App() {
  // State for the code editor content
  const [code, setCode] = useState(`function sum(a, b) {
  return a + b;
}`);

  // State to store AI review text
  const [review, setReview] = useState("");

  // Loading indicator for API call
  const [loading, setLoading] = useState(false);

  // Dark/light mode toggle
  const [darkMode, setDarkMode] = useState(true);

  // Highlight syntax on initial render
  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Function to call backend API and get AI review
  async function reviewCode() {
    setLoading(true);
    setReview(""); // Clear previous review
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });

      const fullText = response.data;
      typeWriterEffect(fullText); // Display review with typewriter effect
    } catch (err) {
      console.log(err);
      setReview("❌ Error while fetching review. Please try again.");
    }
    setLoading(false);
  }

  // Typewriter effect for AI review text
  function typeWriterEffect(text) {
    let i = 0;
    setReview(""); // Reset review text
    const speed = 20; // Typing speed in milliseconds

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
      {/* HEADER */}
      <header>
        <h1>⚡ AI Code Reviewer</h1>
        <div className="actions">
          {/* Toggle dark/light mode */}
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main>
        {/* LEFT PANEL - Code Editor */}
        <div className="left">
          {/* Toolbar showing code stats and clear button */}
          <div className="toolbar">
            <span>📄 {code.split("\n").length} lines</span>
            <span>✍️ {code.length} chars</span>
            <button className="clear-btn" onClick={() => setCode("")}>
              🗑️ Clear Code
            </button>
          </div>

          {/* Code editor component */}
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

          {/* Button to trigger AI code review */}
          <div onClick={reviewCode} className="review">
            {loading ? "⏳ Reviewing..." : "🚀 Review Code"}
          </div>
        </div>

        {/* RIGHT PANEL - Review Output */}
        <div className="right">
          <div className="review-header">
            <h2>Review</h2>
            {/* Clear review button */}
            <button className="clear-btn" onClick={() => setReview("")}>
              🗑️ Clear Review
            </button>
          </div>
          <div className="review-box">
            {/* Display AI review or placeholder */}
            {review ? <pre>{review}</pre> : "⚡ No review yet, try submitting code!"}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
