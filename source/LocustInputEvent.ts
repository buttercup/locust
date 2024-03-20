export type InputEventTrigger = "keypress" | "fill";

export class LocustInputEvent extends Event {
    private _source: InputEventTrigger;

    constructor(source: InputEventTrigger, type: string, eventInitDict?: EventInit) {
        super(type, eventInitDict);
        this._source = source;
    }

    get source(): InputEventTrigger {
        return this._source;
    }
}
