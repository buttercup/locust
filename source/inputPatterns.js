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

// These queries are all modified to that they match inputs of type=text as well
// as inputs with no type attribute at all. Each line (query) is turned into 2
// queries, one with "input[type=text]" as the new prefix (replacing "input") and
// one with "input:not([type])".
const USERNAMES_OPTIONAL_TEXT = [
    "input[id^=user]",
    "input[name^=user]",
    "input[id*=username i]",
    "input[id*=loginemail i]",
    "input[id*=accountname i]",
    "input[title*=username i]",
    "input[placeholder*=username i]",
    "input[name*=email i]",
    "input[name*=login i]"
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
    "input[aria-label*=email i]"
];
