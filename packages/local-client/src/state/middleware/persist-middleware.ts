import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { cellsActions } from "../";

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

let timer: number | undefined;

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
  matcher: isAnyOf(
    cellsActions.moveCell,
    cellsActions.updateCell,
    cellsActions.deleteCell,
    cellsActions.insertCellAfter
  ),
  effect: async (_, listenerApi) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // @ts-ignore i have no idea why typescript complains about this
      listenerApi.dispatch(cellsActions.saveCells());
    }, 1000);
  },
});

export default listenerMiddleware.middleware;
