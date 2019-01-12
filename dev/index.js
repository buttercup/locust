import { getLoginTarget } from "../source/index.js";

function handleTarget(target) {
    console.log("[Locust] Target acquired");
    console.log("[Locust] -> Form", target.form);
    console.log("[Locust] -> Username", target.usernameField);
    console.log("[Locust] -> Password", target.passwordField);
    console.log("[Locust] -> Submit", target.submitButton);
    target.form.style.border = "2px solid red";
    if (target.usernameField) {
        target.usernameField.style.border = "1px dashed blue";
    }
    if (target.passwordField) {
        target.passwordField.style.border = "1px dashed green";
    }
}

console.log("[Locust] Waiting for target...");

const checkInt = setInterval(() => {
    const target = getLoginTarget();
    if (target) {
        clearInterval(checkInt);
        handleTarget(target);
    }
}, 200);
