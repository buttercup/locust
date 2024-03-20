import isVisible from "is-visible";
import {
    FORM_QUERIES,
    OTP_QUERIES,
    PASSWORD_QUERIES,
    SUBMIT_BUTTON_QUERIES,
    USERNAME_QUERIES
} from "./inputPatterns.js";
import { LocustInputEvent } from "./LocustInputEvent.js";

export interface FetchedForm {
    form: HTMLFormElement;
    usernameFields: Array<HTMLInputElement>;
    otpFields: Array<HTMLInputElement>;
    passwordFields: Array<HTMLInputElement>;
    submitButtons: Array<HTMLElement>;
}

const FORM_ELEMENT_SCORING = {
    username: [
        { test: /type="text"/, value: 2 },
        { test: /type="email"/, value: 6 },
        { test: /placeholder="[^\"]*username/i, value: 9 },
        { test: /placeholder="[^\"]*e-?mail/i, value: 4 },
        { test: /name="username"/, value: 10 },
        { test: /id="username"/, value: 10 },
        { test: /id="usr/, value: 4 },
        { test: /(name|id)="(username|login)/, value: 8 },
        { test: /id="user/, value: 5 },
        { test: /name="user/, value: 5 },
        { test: /autocomplete="username"/, value: 6 },
        { test: /autocomplete="[^"]*user/, value: 1 },
        { test: /autocorrect="off"/, value: 1 },
        { test: /autocapitalize="off"/, value: 1 },
        { test: /class="([^\"]*\b|)((uname|usr)\b)/, value: 1 },
        { test: /class="([^\"]*\b|)((username|user|email)\b)/, value: 3 },
        { test: /formcontrolname="[^\"]*user/i, value: 1 }
    ],
    otp: [
        { test: /autocomplete=\"?one-time-code\"?/, value: 10 },
        { test: /id="otp"/, value: 9 },
        { test: /id="mfa"/, value: 9 },
        { test: /id="otp/, value: 7 },
        { test: /id="mfa/, value: 6 },
        { test: /(name|id)="one-time-(password|code)/, value: 10 },
        { test: /id="[^"]+otp"/, value: 5 },
        { test: /id="[^"]+mfa"/, value: 4 },
        { test: /inputmode="numeric"/, value: 3 }
    ],
    password: [
        { test: /type="password"/, value: 10 },
        { test: /name="pass/, value: 8 },
        { test: /id="pwd/, value: 4 },
        { test: /title="pass/, value: 6 },
        { test: /id="password"/, value: 10 },
        { test: /(name|id)="pass/, value: 7 },
        { test: /placeholder="[^\"]*password/i, value: 9 }
    ],
    submit: [
        { test: /type="submit"/, value: 5 },
        { test: /(name|id|title)="(login|log[ _-]in|signin|sign[ _-]in)"/i, value: 10 },
        { test: /<input.+data-bcup-haslogintext="yes"/, value: 8 },
        { test: /<button.+data-bcup-haslogintext="yes"/, value: 8 },
        { test: /<a .*data-bcup-haslogintext="yes"/, value: 2 }
    ]
};
const VISIBILE_SCORE_INCREMENT = 8;

type FormElementScoringType = keyof typeof FORM_ELEMENT_SCORING;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
).set;

function fetchForms(queryEl: Document | HTMLElement = document): Array<HTMLFormElement> {
    return Array.prototype.slice.call(queryEl.querySelectorAll(FORM_QUERIES.join(",")));
}

export function fetchFormsWithInputs(queryEl: Document | HTMLElement = document) {
    return fetchForms(queryEl)
        .map((formEl) => {
            let usernameFields = fetchUsernameInputs(formEl);
            const passwordFields = fetchPasswordInputs(formEl);
            const otpFields = fetchOTPInputs(formEl);
            if (otpFields.length > 0 && passwordFields.length === 0) {
                // No password fields, so filter out any OTP fields from the potential username fields
                usernameFields = usernameFields.filter(field => otpFields.includes(field) === false);
            }
            const form: FetchedForm = {
                form: formEl,
                usernameFields,
                passwordFields,
                otpFields,
                submitButtons: fetchSubmitButtons(formEl)
            };
            if (form.usernameFields.length <= 0 && otpFields.length <= 0) {
                const input = guessUsernameInput(formEl);
                if (input) {
                    form.usernameFields.push(input);
                }
            }
            return form;
        })
        .filter((form) => form.otpFields.length + form.passwordFields.length + form.usernameFields.length > 0);
}

function fetchOTPInputs(queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = OTP_QUERIES.join(", ");
    const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    return sortFormElements(inputs, "otp");
}

function fetchPasswordInputs(queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = PASSWORD_QUERIES.join(", ");
    const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    return sortFormElements(inputs, "password");
}

function fetchSubmitButtons(queryEl: Document | HTMLElement = document) {
    const megaQuery = SUBMIT_BUTTON_QUERIES.join(", ");
    const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
    return sortFormElements(inputs, "submit");
}

function fetchUsernameInputs(queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = USERNAME_QUERIES.join(", ");
    const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    return sortFormElements(inputs, "username");
}

function guessUsernameInput(formEl: HTMLFormElement): HTMLInputElement | null {
    const elements = /^form$/i.test(formEl.tagName)
        ? [...formEl.elements]
        : [...formEl.querySelectorAll("input")];
    const possibleInputs = elements.filter((el) => {
        if (el.tagName.toLowerCase() !== "input") return false;
        if (["email", "text"].indexOf(el.getAttribute("type")) === -1) return false;
        if (/pass(word)?/.test(el.outerHTML)) return false;
        return true;
    });
    return possibleInputs.length > 0 ? possibleInputs[0] as HTMLInputElement : null;
}

function isInput(el: Element): boolean {
    return el.tagName?.toLowerCase() === "input";
}

export function setInputValue(input: HTMLInputElement, value: string): void {
    nativeInputValueSetter.call(input, value);
    const inputEvent = new LocustInputEvent("fill", "input", { bubbles: true });
    input.dispatchEvent(inputEvent);
    const changeEvent = new LocustInputEvent("fill", "change", { bubbles: true });
    input.dispatchEvent(changeEvent);
}

export function sortFormElements<T extends HTMLElement>(elements: Array<T>, type: FormElementScoringType): Array<T> {
    const tests = FORM_ELEMENT_SCORING[type];
    if (!tests) {
        throw new Error(`Failed sorting form elements: Type is invalid: ${type}`);
    }
    const getInputScore = (input) => {
        const html = input.outerHTML;
        let score = tests.reduce((current, check) => {
            const value = check.test.test(html) ? check.value : 0;
            return current + value;
        }, 0);
        if (isVisible(input)) {
            score += VISIBILE_SCORE_INCREMENT;
        }
        if (typeof input.value === "string" && input.value.length > 0) {
            score -= 10;
        }
        input.setAttribute("data-bcup-score", score);
        return score;
    };
    return elements.sort((elA, elB) => {
        const scoreA = getInputScore(elA);
        const scoreB = getInputScore(elB);
        if (scoreA > scoreB) {
            return -1;
        } else if (scoreB > scoreA) {
            return 1;
        }
        return 0;
    });
}
