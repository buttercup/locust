import { getSharedObserver } from "./UnloadObserver.js";

// Initialise the DOM unload observer
getSharedObserver();

export { getLoginTarget, getLoginTargets } from "./loginTargets.js";
export { LoginTarget } from "./LoginTarget.js";
export * from "./types.js";
