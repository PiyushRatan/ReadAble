import { useState } from "react";
import Tesseract from "tesseract.js";

function OCRComponent() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m), // progress log
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const translateText = () => {
    // Temporary dummy translation (reverse string)
    // Later: replace with API call
    const translated = text.split("").reverse().join("");
    setTranslatedText(translated);
  };

  const speakText = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Accessibility App</h2>

      <input type="file" accept="image/*" onChange={handleFile} />

      {loading && <p>Processing OCR...</p>}

      {text && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Detected Text:</h4>
          <p>{text}</p>
          <button onClick={translateText} style={{ marginRight: "1rem" }}>
            Translate
          </button>
          <button onClick={() => speakText(text)}>Read Aloud</button>
        </div>
      )}

      {translatedText && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Translated Text:</h4>
          <p>{translatedText}</p>
          <button onClick={() => speakText(translatedText)}>
            Read Aloud Translation
          </button>
        </div>
      )}
    </div>
  );
}

export default OCRComponent;
