import { LocustInputEvent } from "./LocustInputEvent.js";

const MAX_TYPE_WAIT = 20
const MIN_TYPE_WAIT = 2;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
).set;

async function sleep(time: number): Promise<void> {
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export async function typeIntoInput(input: HTMLInputElement, value: string): Promise<void> {
    // Focus input
    const focusEvent = new FocusEvent("focus", { bubbles: true });
    input.dispatchEvent(focusEvent);
    // Start typing
    const characters = value.split("");
    let newValue = "";
    while (characters.length > 0) {
        const char = characters.shift();
        newValue = `${newValue}${char}`;
        // Set using attribute
        input.setAttribute("value", newValue);
        // Set using native methods
        const proto = Object.getPrototypeOf(input);
        const protoSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
        nativeInputValueSetter.call(input, newValue);
        if (protoSetter && nativeInputValueSetter !== protoSetter) {
            protoSetter.call(input, newValue);
        }
        // Try react set (React 16)
        const tracker = (input as any)._valueTracker;
        if (tracker) {
            tracker.setValue(newValue);
        }
        // Input event data takes the single new character
        const inputEvent = new LocustInputEvent("fill", "input", { bubbles: true, data: char });
        input.dispatchEvent(inputEvent);
        // Wait
        const waitTime = Math.floor(Math.random() * (MAX_TYPE_WAIT - MIN_TYPE_WAIT)) + MIN_TYPE_WAIT;
        await sleep(waitTime);
    }
    // Blur input
    const blurEvent = new FocusEvent("blur", { bubbles: true });
    input.dispatchEvent(blurEvent);
    // The change event gets all of the new data
    const changeEvent = new LocustInputEvent("fill", "change", { bubbles: true, data: value });
    input.dispatchEvent(changeEvent);
}
