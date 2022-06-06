import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkPathPlugin } from "./plugins/unpk-path-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

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

  return (
    <div className="editor-wrapper">
      <CodeEditor initialValue="" onChange={(value) => setInput(value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};
