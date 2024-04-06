export type InputEventTrigger = "keypress" | "fill";

export class LocustInputEvent extends InputEvent {
    private _source: InputEventTrigger;

    constructor(
        source: InputEventTrigger,
        type: string,
        eventInitDict?: InputEventInit
    ) {
        super(type, eventInitDict);
        this._source = source;
    }

    /**
     * React 15 compat
     * @see https://chuckconway.com/changing-a-react-input-value-from-vanilla-javascript/
     */
    get simulated(): boolean {
        return true;
    }

    get source(): InputEventTrigger {
        return this._source;
    }
}
