import { getLoginTarget, getLoginTargets } from "./loginTargets.js";
import { getSharedObserver } from "./UnloadObserver.js";

// Initialise the DOM unload observer
getSharedObserver();

/**
 * The Locust library
 * @module Locust
 */
export default {
    getLoginTarget,
    getLoginTargets
};
