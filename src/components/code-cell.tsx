import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import ResizableBox from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks";
import { useAppSelector } from "../hooks";
import "./code-cell.css";

type CodeCellProps = {
  cell: Cell;
};

export const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useAppSelector((state) => state.bundles.data[cell.id]);

  useEffect(() => {
    if (!bundle) {
      createBundle({ cellId: cell.id, input: cell.content });
      return;
    }

    const timer = setTimeout(async () => {
      createBundle({ cellId: cell.id, input: cell.content });
    }, 750);
    return () => {
      clearTimeout(timer);
    };
  }, [cell.id, cell.content, createBundle]);

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
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress max="100" className="progress is-small is-primary">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.error} />
          )}
        </div>
      </div>
    </ResizableBox>
  );
};

export default CodeCell;
