import { PASSWORD_QUERIES, SUBMIT_BUTTON_QUERIES, USERNAME_QUERIES } from "./inputPatterns.js";

const FORM_ELEMENT_SCORING = {
    username: [
        { test: /type="text"/, value: 2 },
        { test: /type="email"/, value: 6 },
        { test: /placeholder="[^\"]*username/i, value: 9 },
        { test: /name="username"/, value: 10 },
        { test: /id="username"/, value: 10 },
        { test: /(name|id)="(username|login)/, value: 8 }
    ],
    password: [
        { test: /type="password"/, value: 10 },
        { test: /name="pass/, value: 8 },
        { test: /title="pass/, value: 6 },
        { test: /id="password"/, value: 10 },
        { test: /(name|id)="pass/, value: 7 },
        { test: /placeholder="[^\"]*password/i, value: 9 }
    ],
    submit: [
        { test: /type="submit"/, value: 5 },
        { test: /(name|id|title)="(login|log[ _-]in|signin|sign[ _-]in)"/i, value: 10 }
    ]
};

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

function fetchForms(queryEl = document) {
    return Array.prototype.slice.call(queryEl.getElementsByTagName("form"));
}

export function fetchFormsWithInputs(queryEl = document) {
    return fetchForms(queryEl)
        .map(formEl => ({
            form: formEl,
            usernameFields: fetchUsernameInputs(formEl),
            passwordFields: fetchPasswordInputs(formEl),
            submitButtons: fetchSubmitButtons(formEl)
        }))
        .filter(form => form.passwordFields.length > 0);
}

function fetchPasswordInputs(queryEl = document) {
    const megaQuery = PASSWORD_QUERIES.join(", ");
    return Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
}

function fetchSubmitButtons(queryEl = document) {
    const megaQuery = SUBMIT_BUTTON_QUERIES.join(", ");
    return Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
}

function fetchUsernameInputs(queryEl = document) {
    const megaQuery = USERNAME_QUERIES.join(", ");
    return Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
}

export function setInputValue(input, value) {
    nativeInputValueSetter.call(input, value);
    const inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
    const changeEvent = new Event("change", { bubbles: true });
    input.dispatchEvent(changeEvent);
}

export function sortFormElements(elements, type) {
    const tests = FORM_ELEMENT_SCORING[type];
    if (!tests) {
        throw new Error(`Failed sorting form elements: Type is invalid: ${type}`);
    }
    const getInputScore = input => {
        const html = input.outerHTML;
        return tests.reduce((current, check) => {
            const value = check.test.test(html) ? check.value : 0;
            return current + value;
        }, 0);
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
