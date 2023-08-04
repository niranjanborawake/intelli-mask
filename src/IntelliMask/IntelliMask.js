import { useState } from "react";
import "./index.css";

export default function IntelliMask() {
  const serviceUrl = localStorage.getItem("__service__url");
  const [maskUnmaskUrl, setMaskUnmaskUrl] = useState(serviceUrl);
  const [url, setUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [uuid, setUuid] = useState("");
  const [showServiceUrlEditor, setShowServiceUrlEditor] = useState(
    !maskUnmaskUrl
  );
  const mask = async () => {
    fetch(`${maskUnmaskUrl}/anonymize`, {
      method: "POST",
      body: JSON.stringify({ text: inputText }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log({ response });
        const { text, uuid: ruuid } = response.json();
        setOutputText(text);
        setUuid(ruuid);
        return response;
      })
      .catch((error) => console.error(error));
  };
  const unmask = async () => {
    fetch(`${maskUnmaskUrl}/deanonymize`, {
      method: "POST",
      body: JSON.stringify({
        text: outputText,
        uuid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log({ response });
        const { text } = response.json();
        setInputText(text);
        return response;
      })
      .catch((error) => console.error(error));
  };

  return (
    <section className="im-app">
      <header>
        <h2>IntelliMask</h2>
      </header>
      {showServiceUrlEditor ? (
        <section className="im-url-configuration">
          <input
            placeholder="Enter mask/unmask service base path. Do not end with /"
            onChange={(event) => setUrl(event.target.value)}
          />
          <br />
          <button
            disabled={!url}
            type="button"
            onClick={() => {
              setMaskUnmaskUrl(url);
              localStorage.setItem("__service__url", url);
              setShowServiceUrlEditor(false);
            }}
          >
            Set URL
          </button>
        </section>
      ) : (
        <>
          <span>Mask Service Path: {maskUnmaskUrl}</span>
          <button
            onClick={() => {
              setShowServiceUrlEditor(true);
            }}
            type="button"
          >
            Edit
          </button>
          <section className="im-text">
            <div className="im-col">
              <h3>Unmasked Text</h3>
              <textarea
                value={inputText}
                rows={10}
                onChange={(event) => setInputText(event.target.value)}
              />
              <br />
              <button type="button" onClick={() => mask()}>
                Mask
              </button>
            </div>
            <div className="im-col">
              <h3>Masked Text</h3>

              <textarea
                value={outputText}
                rows={10}
                onChange={(event) => setOutputText(event.target.value)}
              />
              <br />
              <button type="button" onClick={() => unmask()}>
                Unmask
              </button>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
