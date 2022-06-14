import MDEditor from "@uiw/react-md-editor";
import React, { useState, useEffect, useRef } from "react";
import "./text-editor.css";
import { Cell } from "../state";
import { useActions } from "../hooks";

type TextEditorProps = {
  cell: Cell;
};

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(value) => updateCell(cell.id, value ?? "")}
        />
      </div>
    );
  } else
    return (
      <div className="text-editor card" onClick={() => setEditing(true)}>
        <div className="card-content">
          <MDEditor.Markdown source={cell.content || "Click to edit"} />
        </div>
      </div>
    );
};

export default TextEditor;
