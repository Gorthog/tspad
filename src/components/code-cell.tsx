import { useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import ResizableBox from "./resizable";

export const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <ResizableBox direction="vertical">
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ResizableBox direction="horizontal">
          <CodeEditor initialValue="" onChange={(value) => setInput(value)} />
        </ResizableBox>
        <Preview code={code} />
      </div>
    </ResizableBox>
  );
};

export default CodeCell;
