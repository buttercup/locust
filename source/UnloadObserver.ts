import EventEmitter from "eventemitter3";

interface UnloadObserverEvents {
    unloading: () => void;
}

let __sharedInstance: UnloadObserver | null;

export default class UnloadObserver extends EventEmitter<UnloadObserverEvents> {
    protected _willUnload: boolean = false;

    constructor() {
        super();
        window.addEventListener("beforeunload", () => {
            this._willUnload = true;
            this.emit("unloading");
        });
    }

    get willUnload() {
        return this._willUnload;
    }
}

export function getSharedObserver(): UnloadObserver {
    if (!__sharedInstance) {
        __sharedInstance = new UnloadObserver();
    }
    return __sharedInstance;
}
