export type InputEventTrigger = "keypress" | "fill";

export class LocustInputEvent extends InputEvent {
    private _data: string;
    private _source: InputEventTrigger;

    constructor(
        source: InputEventTrigger,
        type: string,
        data: string,
        eventInitDict?: EventInit
    ) {
        super(type, eventInitDict);
        this._source = source;
        this._data = data;
    }

    get data(): string {
        return this._data;
    }

    get source(): InputEventTrigger {
        return this._source;
    }
}
