import { PASSWORD_QUERIES, SUBMIT_BUTTON_QUERIES, USERNAME_QUERIES } from "./inputPatterns.js";

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
