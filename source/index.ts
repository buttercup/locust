import { getSharedObserver } from "./UnloadObserver.js";

// Initialise the DOM unload observer
getSharedObserver();

export { getLoginTarget, getLoginTargets } from "./loginTargets.js";
export * from "./types.js";
