// NB: Some of these selectors use the case-insensitive flag, which is only
// available in CSS 4 selectors: https://caniuse.com/#feat=css-case-insensitive

export const FORM_QUERIES = ["form", "div.login", "div.signin"];

export const OTP_QUERIES = [
    "input[autocomplete=one-time-code]",
    "input[id^=mfa]",
    "input[id^=otp]",
    "input[id$=otp]",
    "input[name^=mfa]",
    "input[name=one-time-code]",
    "input[name=one-time-password]",
    "input[id=one-time-code]",
    "input[id=one-time-password]",
    "[id*=otp] input[inputmode=numeric]",
    "[id*=mfa] input[inputmode=numeric]",
    "[name*=otp] input[inputmode=numeric]",
    "[name*=mfa] input[inputmode=numeric]"
];

export const PASSWORD_QUERIES = [
    "input[type=password]",
    "input[name^=pass]",
    "input[id^=pwd]",
    "input[title*=password i]",
    "input[placeholder*=password i]",
    "input[id*=password i]",
    "input[aria-label*=password i]",
    ".login input[type=password]"
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
    "button[title*='sign-in' i]",
    "div[role=button]",
    "[data-bcup-haslogintext=yes]"
];

// These queries are all modified to that they match inputs of type=text as well
// as inputs with no type attribute at all. Each line (query) is turned into 2
// queries, one with "input[type=text]" as the new prefix (replacing "input") and
// one with "input:not([type])".
const USERNAMES_OPTIONAL_TEXT = [
    "input[id^=user]",
    "input[id^=usr]",
    "input[name^=user i]",
    "input[id*=username i]",
    "input[id*=accountname i]",
    "input[title*=username i]",
    "input[placeholder*=username i]",
    "input[placeholder*=email i]",
    "input[autocomplete*=user]",
    "input[name*=email i]",
    "input[name*=login i]",
    "input[id*=email i]",
    "input[id*=login i]",
    "input[formcontrolname*=user i]"
].reduce(
    (queries, next) => [
        ...queries,
        next.replace(/^input/, "input[type=text]"),
        next.replace(/^input/, "input:not([type])")
    ],
    []
);

// Regular username queries that are not transformed:
export const USERNAME_QUERIES = [
    ...USERNAMES_OPTIONAL_TEXT,
    "input[type=email]",
    "input[aria-label*=username i]",
    "input[aria-label*=email i]",
    ".login input[type=text]",
    ".login input[type=email]",
    "form[id*=login i] input[type=text]",
    "form[name*=login i] input[type=text]"
];
