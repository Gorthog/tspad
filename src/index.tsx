import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkPathPlugin } from "./plugins/unpk-path-plugin";
import CodeEditor from "./components/code-editor";

export const App = () => {
  const ref = useRef<boolean>();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [input, setInput] = useState("");

  const startService = async () => {
    try {
      await esbuild.initialize({
        worker: true,
        wasmURL: "https://www.unpkg.com/esbuild-wasm/esbuild.wasm",
      });
      ref.current = true;
    } catch {}
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      1;
      return;
    }

    iframe.current!.srcdoc = html;

    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkPathPlugin(), fetchPlugin(input)],
      define: {
        global: "windows",
      },
    });

    iframe.current?.contentWindow?.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root">
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (e) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + e + '</div>';
              console.error(e);
            }
          }, false)

        </script>
      </body>
    </html>
  `;
  return (
    <div className="editor-wrapper">
      <CodeEditor initialValue="" onChange={(value) => setInput(value)} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe ref={iframe} sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};
