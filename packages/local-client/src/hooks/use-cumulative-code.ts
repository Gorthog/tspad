import { useAppSelector } from "./hooks";

export const useCumulativeCode = (cellId: string) => {
  const cumulativeCodeArray = useAppSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
      import _React from "react";
      import { createRoot as _createRoot } from "react-dom/client";

      var show = (value) => {
      const rootElement = document.getElementById("root");
      if (typeof value === "object") {
        if (value.$$typeof && value.props) {
          const root = _createRoot(rootElement);
          root.render(value);
        } else {
          rootElement.innerHTML =
            "<pre>" + JSON.stringify(value, null, 2) + "</pre>";
        }
      } else rootElement.innerHTML = value;
    };
    `;
    const showFuncNoop = "var show = () => {};";

    const cumulativeCode: string[] = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else cumulativeCode.push(showFuncNoop);

        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  });
  const priorCode = cumulativeCodeArray.slice(0, -1);
  const cumulativeCode = cumulativeCodeArray
    .join("\n")
    // this is a workaround for bundler error seeing the same symbol twice
    .replaceAll(/import.*\s+from\s+['"]\.\/cell\d+['"]/g, "");
  return { cumulativeCode, priorCode };
};
