import EventEmitter from "eventemitter3";

let __sharedInstance;

export default class UnloadObserver extends EventEmitter {
    constructor() {
        super();
        this._willUnload = false;
        window.addEventListener("beforeunload", () => {
            this._willUnload = true;
            this.emit("unloading");
        });
    }

    get willUnload() {
        return this._willUnload;
    }
}

export function getSharedObserver() {
    if (!__sharedInstance) {
        __sharedInstance = new UnloadObserver();
    }
    return __sharedInstance;
}
