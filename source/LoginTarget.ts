import isVisible from "is-visible";
import EventEmitter from "eventemitter3";
import { getSharedObserver as getUnloadObserver } from "./UnloadObserver.js";
import { LoginTargetFeature } from "./types.js";
import { LocustInputEvent } from "./LocustInputEvent.js";
import { typeIntoInput } from "./typing.js";

interface ChangeListener {
    input: HTMLElement;
    listener: () => void;
}

interface LoginTargetEvents {
    formSubmitted: (event: { source: "form" | "submitButton"; }) => void;
    valueChanged: (event: { source: "keypress" | "fill", type: LoginTargetFeature; value: string; }) => void;
}

export const FORCE_SUBMIT_DELAY = 7500;
const NOOP = () => {};

function getEventListenerForElement(type: LoginTargetFeature): string {
    switch (type) {
        case LoginTargetFeature.Form:
            return "submit";
        case LoginTargetFeature.Submit:
            return "click";
        case LoginTargetFeature.Username:
        /* falls-through */
        case LoginTargetFeature.Password:
        /* falls-through */
        default:
            return "input";
    }
}

/**
 * The LoginTarget class which represents a 'target' for logging in
 * with some credentials
 */
export class LoginTarget extends EventEmitter<LoginTargetEvents> {
    public baseScore: number = 0;

    protected _changeListeners: Record<LoginTargetFeature, null | ChangeListener> = {
        [LoginTargetFeature.Username]: null,
        [LoginTargetFeature.Password]: null,
        [LoginTargetFeature.OTP]: null,
        [LoginTargetFeature.Submit]: null,
        [LoginTargetFeature.Form]: null
    };
    protected _forceSubmitDelay: number = FORCE_SUBMIT_DELAY;
    protected _form: HTMLFormElement | HTMLDivElement | null = null;
    protected _otpField: HTMLInputElement | null = null;
    protected _passwordField: HTMLInputElement | null = null;
    protected _submitButton: HTMLElement | null = null;
    protected _usernameField: HTMLInputElement | null = null;

    /**
     * Delay in milliseconds that the library should wait before force submitting the form
     */
    get forceSubmitDelay() {
        return this._forceSubmitDelay;
    }

    /**
     * The target login form
     */
    get form() {
        return this._form;
    }

    /**
     * The OTP input element
     */
    get otpField() {
        return this._otpField;
    }

    /**
     * The password input element
     */
    get passwordField() {
        return this._passwordField;
    }

    /**
     * The submit button element
     */
    get submitButton() {
        return this._submitButton;
    }

    /**
     * The username input element
     */
    get usernameField() {
        return this._usernameField;
    }

    set forceSubmitDelay(delay: number) {
        this._forceSubmitDelay = delay;
    }

    set form(form: HTMLFormElement | HTMLDivElement) {
        if (form) {
            this._form = form;
            this._listenForUpdates(LoginTargetFeature.Form, form);
        }
    }

    set otpField(field: HTMLInputElement) {
        if (field) {
            this._otpField = field;
            this._listenForUpdates(LoginTargetFeature.OTP, field);
        }
    }

    set passwordField(field: HTMLInputElement) {
        if (field) {
            this._passwordField = field;
            this._listenForUpdates(LoginTargetFeature.Password, field);
        }
    }

    set submitButton(button: HTMLElement) {
        if (button) {
            this._submitButton = button;
            this._listenForUpdates(LoginTargetFeature.Submit, button);
        }
    }

    set usernameField(field: HTMLInputElement) {
        if (field) {
            this._usernameField = field;
            this._listenForUpdates(LoginTargetFeature.Username, field);
        }
    }

    /**
     * Calculate the score of the login target
     * This can be used to compare LoginTargets by their likelihood of being
     * the correct login form. Higher number is better.
     * @returns The calculated score
     * @memberof LoginTarget
     */
    calculateScore(): number {
        let score = this.baseScore;
        score += this.usernameField ? 10 : 0;
        score += this.passwordField ? 10 : 0;
        score += this.submitButton ? 10 : 0;
        if (isVisible(this.form)) {
            score += 10;
        }
        return score;
    }

    /**
     * Enter OTP digits into the OTP field.
     * @param otp The OTP digits to enter
     * @returns A promise that resolves once the data has been entered
     * @memberof LoginTarget
     * @example
     *      loginTarget.fillOTP("123456")
     */
    async fillOTP(otp: string): Promise<void> {
        if (this.otpField) {
            await typeIntoInput(this.otpField, otp);
        }
    }

    /**
     * Fill password into the password field.
     * @param password The password to enter
     * @returns A promise that resolves once the data has been entered
     * @memberof LoginTarget
     * @example
     *      loginTarget.fillPassword("myPassword")
     */
    async fillPassword(password: string): Promise<void> {
        if (this.passwordField) {
            await typeIntoInput(this.passwordField, password);
        }
    }

    /**
     * Fill username into the username field.
     * @param username The username to enter
     * @returns A promise that resolves once the data has been entered
     * @memberof LoginTarget
     * @example
     *      loginTarget.fillUsername("myUsername")
     */
    async fillUsername(username: string): Promise<void> {
        if (this.usernameField) {
            await typeIntoInput(this.usernameField, username);
        }
    }

    /**
     * Login using the form
     * Enters the credentials into the form and logs in by either pressing the
     * login button or by submitting the form. The `force` option allows for
     * trying both methods: first by clicking the button and second by calling
     * `form.submit()`. When using `force=true`, if clicking the button doesn't
     * unload the page in `target.forceSubmitDelay` milliseconds,
     * `form.submit()` is called. If no form submit button is present, `force`
     * does nothing as `form.submit()` is called immediately.
     * @param username The username to login with
     * @param password The password to login with
     * @param force Whether or not to force the login (defaults to
     *  false)
     * @returns A promise that resolves once the login procedure has
     * completed. Let's be honest: there's probably no point to listen to the
     * return value of this function.
     * @example
     *      loginTarget.login("myUsername", "myPassword");
     */
    async login(username: string, password: string, force: boolean = false): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit(force);
    }

    /**
     * Submit the associated form
     * You probably don't want this function. `login` or `enterDetails` are way
     * better.
     * @param force Force the submission (defaults to false)
     * @returns A promise that resolves once submission has been completed
     */
    async submit(force: boolean = false): Promise<void> {
        if (this.submitButton) {
            // Click button
            this.submitButton.click();
        } else if (this.form.tagName.toLowerCase() === "form") {
            // No button, just try submitting
            (this.form as HTMLFormElement).submit();
        } else {
            throw new Error("Invalid form: Not form element and no valid submit button");
        }
        if (force) {
            await this._waitForNoUnload();
        }
    }

    /**
     * Attach an event listener to listen for input changes
     * Attaches listeners for username/password input changes and emits an event
     * when a change is detected.
     * @param type The type of input (username/password)
     * @param input The target element
     * @fires LoginTarget#valueChanged
     * @fires LoginTarget#formSubmitted
     */
    protected _listenForUpdates(type: LoginTargetFeature, input: HTMLElement) {
        if (Object.values(LoginTargetFeature).includes(type) === false) {
            throw new Error(`Failed listening for field changes: Unrecognised type: ${type}`);
        }
        // Detect the necessary event listener name
        const eventListenerName = getEventListenerForElement(type);
        // Check if a listener exists already, and clear it if it does
        if (this._changeListeners[type]) {
            const { input, listener } = this._changeListeners[type];
            input.removeEventListener(eventListenerName, listener, false);
        }
        // Emit a value change event
        let handleEvent: (evt?: Event) => void = NOOP;
        if (type === "submit" || type === "form") {
            // Listener function for the submission of the form
            const source = type === "form" ? "form" : "submitButton";
            handleEvent = () => this.emit("formSubmitted", { source });
        } else {
            const emit = (value: string, source: "keypress" | "fill") => {
                this.emit("valueChanged", {
                    source,
                    type,
                    value
                });
            };
            // Listener function for the input element
            handleEvent = function (evt: Event) {
                const source = evt instanceof LocustInputEvent ? evt.source : "keypress";
                emit(this.value, source);
            };
        }
        // Store the listener information
        this._changeListeners[type] = {
            input,
            listener: handleEvent
        };
        // Attach the listener
        input.addEventListener(eventListenerName, handleEvent, false);
    }

    /**
     * Wait for either the unload event to fire or the delay to
     * time out
     * @returns A promise that resolves once either the delay has
     * expired for the page has begun unloading.
     * @memberof LoginTarget
     */
    protected async _waitForNoUnload(): Promise<void> {
        const unloadObserver = getUnloadObserver();
        const hasUnloaded = await Promise.race([
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(false);
                }, this.forceSubmitDelay);
            }),
            new Promise((resolve) => {
                if (unloadObserver.willUnload) {
                    return resolve(true);
                }
                unloadObserver.once("unloading", () => {
                    resolve(true);
                });
            })
        ]);
        if (!hasUnloaded && this.form.tagName.toLowerCase() === "form") {
            // No unload events detected, so we need for force submit
            (this.form as HTMLFormElement).submit();
        }
    }
}
