import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { cellsActions } from "../";

const listenerMiddleware = createListenerMiddleware();

let timer: number | undefined;

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
