import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./code-editor.css";
import "./syntax.css";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { MouseEventHandler, useRef } from "react";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MonacoJSXHighlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const onMount: OnMount = (monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(monacoEditor.getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    const highlighter = new MonacoJSXHighlighter(
      // @ts-ignore
      window.monaco,
      parse,
      traverse,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(100);
    highlighter.addJSXCommentCommand();
  };

  const onFormatClick: MouseEventHandler<HTMLButtonElement> = () => {
    const unformatted = editorRef.current?.getValue();
    if (unformatted) {
      const formatted = prettier
        .format(unformatted, {
          parser: "babel",
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: "all",
        })
        .replace(/\n$/, "");
      editorRef.current?.setValue(formatted);
    }
  };

  return (
    // without overflow: auto, monaco editor performance when resizing is horrible
    <div className="editor-wrapper" style={{ overflow: "auto" }}>
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onMount}
        value={initialValue}
        language="javascript"
        theme="vs-dark"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
