import { SUBMIT_BUTTON_QUERIES } from "./inputPatterns.js";

const LOGIN_BUTTON_ATTR = "data-bcup-haslogintext";
const LOGIN_TEXT_REXP = /^(login|log in|log-in|signin|sign in|sign-in|enter|next|continue)$/i;
const REGULAR_BUTTONS = ["button", "a"];

export function revealShySubmitButtons(queryEl: Document | HTMLElement = document): void {
    const query = [...SUBMIT_BUTTON_QUERIES, ...REGULAR_BUTTONS].join(",");
    const buttons = Array.prototype.slice.call(queryEl.querySelectorAll(query));
    buttons
        .filter((button) => button.hasAttribute(LOGIN_BUTTON_ATTR) === false)
        .forEach((button) => {
            const text = button.innerText.trim().toLowerCase();
            const hasLoginText = LOGIN_TEXT_REXP.test(text);
            button.setAttribute(LOGIN_BUTTON_ATTR, hasLoginText ? "yes" : "no");
        });
}
