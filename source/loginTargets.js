import { fetchFormsWithInputs } from "./inputs.js";
import LoginTarget from "./LoginTarget.js";

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
