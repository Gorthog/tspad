import { useState, useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import ResizableBox from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks";

type CodeCellProps = {
  cell: Cell;
};

export const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState<string | undefined>("");
  const [err, setErr] = useState<string | undefined>("");
  const [input, setInput] = useState("");
  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.error);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

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
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </ResizableBox>
        <Preview code={code} err={err} />
      </div>
    </ResizableBox>
  );
};

export default CodeCell;
