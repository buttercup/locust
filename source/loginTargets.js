import { fetchFormsWithInputs } from "./inputs.js";

export function getLoginTargets(queryEl = document) {
    // let { username, password, submit } = fetchAllInputs(queryEl);
    // const forms = fetchForms();
    // const potentialTargets = forms
    //     .map(formElement => {
    //         const childUsernameFields = [];
    //         const childPasswordFields = [];
    //         const childSubmitButtons = [];
    //         const nonChildUsernameFields = [];
    //         const nonChildPassword fields = [];
    //         const nonChildSubmitButtons = [];
    //         username.forEach(usernameField => {
    //             if (isDescendant(formElement, usernameField))
    //         });
    //     });
    return fetchFormsWithInputs(queryEl)
        .map(form => {

        });
}
