import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { fetchPlugin } from "./plugins/fetch-plugin";

import { unpkPathPlugin } from "./plugins/unpk-path-plugin";

export const App = () => {
  const ref = useRef<boolean>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

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
      return;
    }

    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkPathPlugin(), fetchPlugin(input)],
      define: {
        global: "windows",
      },
    });

    setCode(result.outputFiles[0].text);
  };

  const html = `
<script>${code}</script>
  `;
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};
