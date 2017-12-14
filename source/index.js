import { getLoginTarget, getLoginTargets } from "./loginTargets.js";
import { getSharedObserver } from "./UnloadObserver.js";

// Initialise the DOM unload observer
getSharedObserver();

module.exports = {
    getLoginTarget,
    getLoginTargets
};
