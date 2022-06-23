import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import CellList from "./components/cell-list";
import { KeyboardEventHandler, useEffect } from "react";

export const App = () => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.ctrlKey && event.key === "s") {
        alert(
          "Content is being saved automatically on change. No need to save it manually."
        );
      }
    };
    document.addEventListener("keydown", listener, { capture: true });

    return () => {
      document.removeEventListener("keydown", listener, { capture: true });
    };
  }, []);

  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};
