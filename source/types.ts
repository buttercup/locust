export type ElementValidatorCallback = (feature: LoginTargetFeature, element: HTMLElement) => boolean;

export enum LoginTargetFeature {
    Form = "form",
    OTP = "otp",
    Password = "password",
    Submit = "submit",
    Username = "username"
}
