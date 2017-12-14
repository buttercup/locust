import isVisible from "is-visible";
import { dedupe } from "./arrays.js";

export const FORCE_SUBMIT_DELAY = 7500;

export default class LoginTarget {
    constructor() {
        this._form = null;
        this._usernameFields = [];
        this._passwordFields = [];
        this._submitButtons = [];
        this._forceSubmitDelay = FORCE_SUBMIT_DELAY;
    }

    get forceSubmitDelay() {
        return this._forceSubmitDelay;
    }

    get form() {
        return this._form;
    }

    get passwordFields() {
        return this._passwordFields;
    }

    get submitButtons() {
        return this._submitButtons;
    }

    get usernameFields() {
        return this._usernameFields;
    }

    set forceSubmitDelay(delay) {
        this._forceSubmitDelay = delay;
    }

    set form(newForm) {
        this._form = newForm;
    }

    addPasswordFields(...fields) {
        this._passwordFields.push(...fields);
        this._passwordFields = dedupe(this._passwordFields);
        return this;
    }

    addSubmitButtons(...buttons) {
        this._submitButtons.push(...buttons);
        this._submitButtons = dedupe(this._submitButtons);
        return this;
    }

    addUsernameFields(...fields) {
        this._usernameFields.push(...fields);
        this._usernameFields = dedupe(this._usernameFields);
        return this;
    }

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

    enterDetails(username, password) {
        this.usernameFields.forEach(field => {
            field.value = username;
            const changeEvent = new Event("change");
            field.dispatchEvent(changeEvent);
        });
        this.passwordFields.forEach(field => {
            field.value = password;
            const changeEvent = new Event("change");
            field.dispatchEvent(changeEvent);
        });
        return Promise.resolve();
    }

    login(username, password, force = false) {
        return this.enterDetails(username, password).then(() => this.submit(force));
    }

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

    _waitForNoUnload() {
        return Promise.resolve();
    }
}
