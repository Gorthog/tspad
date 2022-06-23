import "./code-editor.css";
import "./syntax.css";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { MouseEventHandler, useRef } from "react";
import { nanoid } from "nanoid";
import axios from "axios";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  priorCode: string[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
  priorCode,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const onMount: OnMount = (monacoEditor, monaco) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(monacoEditor.getValue());
    });

    async function getReactTypes() {
      const { data } = await axios.get<string>(
        "https://unpkg.com/@types/react/index.d.ts"
      );

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        data,
        `file:///node_modules/@types/react/index.d.ts`
      );
    }

    const id = nanoid();
    const newModel = monaco.editor.createModel(
      monacoEditor.getValue(),
      "typescript",
      monaco.Uri.parse(`${id}.tsx`)
    );
    monacoEditor.getModel()?.dispose();

    newModel.updateOptions({ tabSize: 2 });

    monacoEditor.setModel(newModel);

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
        /** show function is a helper function that can render JSX, string or numbers. */
        const show = (input: number | string | Object): void
        `,
      "show.d.ts"
    );

    for (let i = 0; i < priorCode.length; i++) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        priorCode[i],
        `file:///cell${i}.d.ts`
      );
    }

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
    });

    editorRef.current = monacoEditor;

    getReactTypes();
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
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onMount}
        value={initialValue}
        language="typescript"
        theme="vs-dark"
        height="100%"
        width="100%"
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
