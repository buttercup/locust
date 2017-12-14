import { fetchFormsWithInputs } from "./inputs.js";
import LoginTarget from "./LoginTarget.js";

export function getLoginTarget() {
    const targets = getLoginTargets();
    let bestScore = -1,
        bestTarget = null;
    targets.forEach(target => {
        const score = target.calculateScore();
        if (score > bestScore) {
            bestScore = score;
            bestTarget = target;
        }
    });
    return bestTarget;
}

export function getLoginTargets(queryEl = document) {
    return fetchFormsWithInputs(queryEl).map(info => {
        const { form, usernameFields, passwordFields, submitButtons } = info;
        const target = new LoginTarget();
        target
            .addUsernameFields(...usernameFields)
            .addPasswordFields(...passwordFields)
            .addSubmitButtons(...submitButtons);
        target.form = form;
        return target;
    });
}
