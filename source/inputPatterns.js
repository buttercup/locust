// NB: Some of these selectors use the case-insensitive flag, which is only
// available in CSS 4 selectors: https://caniuse.com/#feat=css-case-insensitive

export const PASSWORD_QUERIES = [
    "input[type=password]",
    "input[name^=pass]",
    "input[title*=password i]",
    "input[placeholder*=password i]",
    "input[id*=password i]",
    "input[aria-label*=password i]"
];

export const SUBMIT_BUTTON_QUERIES = [
    "input[type=submit]",
    "button[type=submit]",
    "button[id*=login i]",
    "button[id*=signin i]",
    "button[id*=sign-in i]",
    "button[title*=login i]",
    "button[title*='log in' i]",
    "button[title*=signin i]",
    "button[title*='sign in' i]",
    "button[title*='sign-in' i]"
];

export const USERNAME_QUERIES = [
    "input[type=text][id^=user]",
    "input[type=text][name^=user]",
    "input[type=text][id*=username i]",
    "input[type=text][title*=username i]",
    "input[type=text][placeholder*=username i]",
    "input[type=text][name*=email i]",
    "input[type=email]",
    "input[aria-label*=username i]",
    "input[aria-label*=email i]"
];
