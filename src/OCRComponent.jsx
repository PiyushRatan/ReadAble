import { useState } from "react";
import Tesseract from "tesseract.js";
import "./OCRComponent.css";

function OCRComponent() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState();
const isProcessing = ocrData && ocrData.status !== 1;
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        setOcrData(m);
      },
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
    const translated = text.split("").reverse().join("");
    setTranslatedText(translated);
  };

  const speakText = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    speechSynthesis.speak(utterance);
  };
  
  
  return (
    <div className="OCRcontainer">
      <header className="ocr-header">
        <h2>OCR & Translation Tool</h2>
        <p>Extract, translate, and listen to text from images</p>
      </header>

      <div className="ocr-card image-processing">
        <h3 >{isProcessing ?"Upload New Image": "Upload Image"}</h3>
        <input type="file" accept="image/*" onChange={handleFile} />

        {loading && <p className="loading">Processing OCR...</p>}
        {ocrData && (
          <div className="progress-box">
            <p>Status: {ocrData.status}</p>
            <p>
              Progress:{" "}
              {ocrData.progress ? (ocrData.progress * 100).toFixed(2) : 0}%
            </p>
          </div>
        )}
      </div>

      <div className="output">
        {text && (
          <div className="ocr-card extracted">
            <h4>📄 Detected Text</h4>
            <p className="ocr-text">{text}</p>
            <div className="button-group">
              <button onClick={translateText}>Translate</button>
              <button onClick={() => speakText(text)}>Read Aloud</button>
            </div>
          </div>
        )}

        {translatedText && (
          <div className="ocr-card translated">
            <h4>🌐 Translated Text</h4>
            <p className="ocr-text">{translatedText}</p>
            <button onClick={() => speakText(translatedText)}>
              Read Aloud Translation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OCRComponent;
