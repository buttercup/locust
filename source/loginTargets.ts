import { fetchFormsWithInputs } from "./inputs.js";
import { LoginTarget } from "./LoginTarget.js";
import { revealShySubmitButtons } from "./prepare.js";

/**
 * Get the best login target on the current page
 * @param queryEl The element to query within
 * @returns A login target or null of none found
 * @see getLoginTargets
 */
export function getLoginTarget(queryEl: Document | HTMLElement = document): LoginTarget | null {
    revealShySubmitButtons(queryEl);
    const targets = getLoginTargets(queryEl);
    let bestScore = -9999,
        bestTarget = null;
    targets.forEach((target) => {
        const score = target.calculateScore();
        if (score > bestScore) {
            bestScore = score;
            bestTarget = target;
        }
    });
    return bestTarget;
}

/**
 * Fetch all login targets
 * Fetches all detected login targets within some element (defaults to the current document).
 * Returned targets are not sorted or processed in any way that would indicate how likely
 * they are to be the 'correct' login form for the page.
 * @param queryEl The element to query within
 * @returns An array of login targets
 */
export function getLoginTargets(queryEl: Document | HTMLElement = document): Array<LoginTarget> {
    revealShySubmitButtons(queryEl);
    return fetchFormsWithInputs(queryEl).map((info) => {
        const { form, otpFields, usernameFields, passwordFields, submitButtons } = info;
        const target = new LoginTarget();
        target.usernameField = usernameFields[0];
        target.passwordField = passwordFields[0];
        target.otpField = otpFields[0];
        target.submitButton = submitButtons[0];
        target.form = form;
        if (submitButtons.length > 1) {
            target.baseScore -= 2;
        }
        if (usernameFields.length > 1) {
            target.baseScore -= 1;
        }
        if (passwordFields.length > 1) {
            target.baseScore -= 2;
        }
        return target;
    });
}
