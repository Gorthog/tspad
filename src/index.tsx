import { useState, useEffect, useRef } from "react";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

export const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
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
