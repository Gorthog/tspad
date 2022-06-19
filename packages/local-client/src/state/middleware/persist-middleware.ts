import { createListenerMiddleware } from "@reduxjs/toolkit";

import todosReducer, {
  todoAdded,
  todoToggled,
  todoDeleted,
} from "../features/todos/todosSlice";

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here
    console.log("Todo added: ", action.payload.text);

    // Can cancel other running instances
    listenerApi.cancelActiveListeners();

    // Run async logic
    const data = await fetchData();

    // Pause until action dispatched or state changed
    if (await listenerApi.condition(matchSomeAction)) {
      // Use the listener API methods to dispatch, get state,
      // unsubscribe the listener, or cancel previous
      listenerApi.dispatch(todoAdded("Buy pet food"));
      listenerApi.unsubscribe();
    }
  },
});
