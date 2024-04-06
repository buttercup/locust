import isVisible from "is-visible";
import {
    FORM_QUERIES,
    OTP_QUERIES,
    PASSWORD_QUERIES,
    SUBMIT_BUTTON_QUERIES,
    USERNAME_QUERIES
} from "./inputPatterns.js";
import { ElementValidatorCallback, LoginTargetFeature } from "./types.js";

export interface FetchedForm {
    form: HTMLFormElement | HTMLDivElement;
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

function fetchForms(queryEl: Document | HTMLElement = document): Array<HTMLFormElement> {
    return Array.prototype.slice.call(queryEl.querySelectorAll(FORM_QUERIES.join(",")));
}

export function fetchFormsWithInputs(
    validator: ElementValidatorCallback,
    queryEl: Document | HTMLElement = document
): Array<FetchedForm> {
    return fetchForms(queryEl).reduce((output: Array<FetchedForm>, formEl: HTMLFormElement | HTMLDivElement) => {
        let usernameFields = fetchUsernameInputs(validator, formEl);
        const passwordFields = fetchPasswordInputs(validator, formEl);
        const otpFields = fetchOTPInputs(validator, formEl);
        if (otpFields.length > 0 && passwordFields.length === 0) {
            // No password fields, so filter out any OTP fields from the potential username fields
            usernameFields = usernameFields.filter(field => otpFields.includes(field) === false);
        }
        const form: FetchedForm = {
            form: formEl,
            usernameFields,
            passwordFields,
            otpFields,
            submitButtons: fetchSubmitButtons(validator, formEl)
        };
        if (form.usernameFields.length <= 0 && otpFields.length <= 0 && passwordFields.length <= 0) {
            return output;
        }
        return [...output, form];
    }, []);
}

function fetchOTPInputs(validator: ElementValidatorCallback, queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = OTP_QUERIES.join(", ");
    let inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    inputs = inputs.filter(input => validator(LoginTargetFeature.OTP, input));
    return sortFormElements(inputs, "otp");
}

function fetchPasswordInputs(validator: ElementValidatorCallback, queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = PASSWORD_QUERIES.join(", ");
    let inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    inputs = inputs.filter(input => validator(LoginTargetFeature.Password, input));
    return sortFormElements(inputs, "password");
}

function fetchSubmitButtons(validator: ElementValidatorCallback, queryEl: Document | HTMLElement = document) {
    const megaQuery = SUBMIT_BUTTON_QUERIES.join(", ");
    let inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)) as Array<HTMLElement>;
    inputs = inputs.filter(input => validator(LoginTargetFeature.Submit, input));
    return sortFormElements(inputs, "submit");
}

function fetchUsernameInputs(validator: ElementValidatorCallback, queryEl: Document | HTMLElement = document): Array<HTMLInputElement> {
    const megaQuery = USERNAME_QUERIES.join(", ");
    let inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery)).filter((el: Element) => isInput(el)) as Array<HTMLInputElement>;
    inputs = inputs.filter(input => validator(LoginTargetFeature.Username, input));
    return sortFormElements(inputs, "username");
}

function isInput(el: Element): boolean {
    return el.tagName?.toLowerCase() === "input";
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
