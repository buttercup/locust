import isVisible from "is-visible";
import { getSharedObserver as getUnloadObserver } from "./UnloadObserver.js";

export const FORCE_SUBMIT_DELAY = 7500;

/**
 * The LoginTarget class which represents a 'target' for logging in
 * with some credentials
 * @class LoginTarget
 */
export default class LoginTarget {
    constructor() {
        this._form = null;
        this._usernameFields = new Set();
        this._passwordFields = new Set();
        this._submitButtons = new Set();
        this._forceSubmitDelay = FORCE_SUBMIT_DELAY;
    }

    /**
     * Delay in milliseconds that the library should wait before force submitting the form
     * @type {Number}
     * @memberof LoginTarget
     */
    get forceSubmitDelay() {
        return this._forceSubmitDelay;
    }

    /**
     * The target login form
     * @type {HTMLFormElement}
     * @memberof LoginTarget
     */
    get form() {
        return this._form;
    }

    /**
     * Array of password fields within the associated form
     * @type {Array.<HTMLInputElement>}
     * @readonly
     * @memberof LoginTarget
     */
    get passwordFields() {
        return [...this._passwordFields.values()];
    }

    /**
     * Array of submit buttons within the associated form
     * @type {Array.<HTMLInputElement|HTMLButtonElement>}
     * @readonly
     * @memberof LoginTarget
     */
    get submitButtons() {
        return [...this._submitButtons.values()];
    }

    /**
     * Array of username fields within the associated form
     * @type {Array.<HTMLInputElement>}
     * @readonly
     * @memberof LoginTarget
     */
    get usernameFields() {
        return [...this._usernameFields.values()];
    }

    set forceSubmitDelay(delay) {
        this._forceSubmitDelay = delay;
    }

    set form(newForm) {
        this._form = newForm;
    }

    /**
     * Add password fields to the target
     * @param {...HTMLInputElement} fields The password fields
     * @returns {LoginTarget} Self
     * @memberof LoginTarget
     */
    addPasswordFields(...fields) {
        for (const item of fields) this._passwordFields.add(item);
        return this;
    }

    /**
     * Add submit buttons to the target
     * @param {...HTMLInputElement} buttons The submit buttons
     * @returns {LoginTarget} Self
     * @memberof LoginTarget
     */
    addSubmitButtons(...buttons) {
        for (const item of buttons) this._submitButtons.add(item);
        return this;
    }

    /**
     * Add username fields to the target
     * @param {...HTMLInputElement} fields The username fields
     * @returns {LoginTarget} Self
     * @memberof LoginTarget
     */
    addUsernameFields(...fields) {
        for (const item of fields) this._usernameFields.add(item);
        return this;
    }

    /**
     * Calculate the score of the login target
     * This can be used to compare LoginTargets by their likelihood of being
     * the correct login form. Higher number is better.
     * @returns {Number} The calculated score
     * @memberof LoginTarget
     */
    calculateScore() {
        let score = 0;
        if (this.usernameFields.length > 0) {
            score += this.usernameFields.length > 1 ? 5 : 10;
        }
        if (this.passwordFields.length > 0) {
            score += this.passwordFields.length > 1 ? 5 : 10;
        }
        if (this.submitButtons.length > 0) {
            score += this.submitButtons.length > 1 ? 5 : 10;
        }
        if (isVisible(this.form)) {
            score += 10;
        }
        return score;
    }

    /**
     * Enter credentials into the form without logging in
     * @param {String} username The username to enter
     * @param {String} password The password to enter
     * @returns {Promise} A promise that resolves once the data has been entered
     * @memberof LoginTarget
     * @example
     *      loginTarget.enterDetails("myUsername", "myPassword");
     */
    enterDetails(username, password) {
        this.usernameFields.slice(0, 1).forEach(field => {
            field.value = username;
            const changeEvent = new Event("change");
            field.dispatchEvent(changeEvent);
        });
        this.passwordFields.slice(0, 1).forEach(field => {
            field.value = password;
            const changeEvent = new Event("change");
            field.dispatchEvent(changeEvent);
        });
        return Promise.resolve();
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
     * @param {String} username The username to login with
     * @param {String} password The password to login with
     * @param {Boolean=} force Whether or not to force the login (defaults to
     *  false)
     * @returns {Promise} A promise that resolves once the login procedure has
     * completed. Let's be honest: there's probably no point to listen to the
     * return value of this function.
     * @memberof LoginTarget
     * @example
     *      loginTarget.login("myUsername", "myPassword");
     */
    login(username, password, force = false) {
        return this.enterDetails(username, password).then(() => this.submit(force));
    }

    /**
     * Submit the associated form
     * You probably don't want this function. `login` or `enterDetails` are way
     * better.
     * @param {Boolean=} force Force the submission (defaults to false)
     * @memberof LoginTarget
     */
    submit(force = false) {
        const [submitButton] = this.submitButtons;
        if (!submitButton) {
            // No button, just try submitting
            this.form.submit();
            return Promise.resolve();
        }
        // Click button
        submitButton.click();
        return force ? this._waitForNoUnload() : Promise.resolve();
    }

    /**
     * Wait for either the unload event to fire or the delay to
     * time out
     * @protected
     * @returns {Promise} A promise that resolves once either the delay has
     * expired for the page has begun unloading.
     * @memberof LoginTarget
     */
    _waitForNoUnload() {
        const unloadObserver = getUnloadObserver();
        return Promise.race([
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(false);
                }, this.forceSubmitDelay);
            }),
            new Promise(resolve => {
                if (unloadObserver.willUnload) {
                    return resolve(true);
                }
                unloadObserver.once("unloading", () => {
                    resolve(true);
                });
            })
        ]).then(hasUnloaded => {
            if (!hasUnloaded) {
                // No unload events detected, so we need for force submit
                this.form.submit();
            }
        });
    }
}
