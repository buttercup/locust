# Locust Changelog

## v2.3.0
_2024-04-06_

 * React value setter support
 * Input value setting via prototypes
 * Form element filtering

## v2.2.1
_2024-03-26_

 * **Bugfix**:
   * Username field guessing flags bad forms as login forms

## v2.2.0
_2024-03-20_

 * `valueChanged` event `source` (`keypress`/`fill`)

## v2.1.0
_2023-05-01_

 * `LoginTarget` event types

## v2.0.3
_2023-04-29_

 * **Bugfix**:
   * OTP-only forms not recognised

## v2.0.2
_2023-04-28_

 * **Bugfix**:
   * OTP fields prioritised lower than username fields

## v2.0.1
_2023-04-28_

 * **Bugfix**:
   * Missing dependencies due to new Typescript build

## v2.0.0
_2023-04-28_

 * Typescript
 * OTP support
 * **Breaking changes**:
   * ESM
   * `LoginTarget#enterDetails` removed

## v1.0.0
_2022-09-15_

 * Username detection improvements (last-resort strategy)
 * Build toolchain update

## v0.10.0
_2019-01-12_

 * Add more selectors for more forms
 * Reduce requirement of min-password-fields to require at least 1 username *or* password field
 * Add recognition for more submit buttons

## v0.9.0
_2018-08-23_

 * Add more selectors to recognise more login forms
 * Improve filtering and scoring of login forms
 * Improve form detection

## v0.8.0
_2018-03-22_

 * Sort detected form inputs by scores
 * Sort detected form inputs by viewability

## v0.7.0
_2018-03-22_

 * Add more scoring rules for form elements

## v0.6.0
_2018-02-16_

 * Add methods for filling specific form inputs only

## v0.5.0
_2018-01-28_

 * Event listeners for form submission

## v0.4.0
_2018-01-27_

 * Data update events for input changes
 * Support for more login forms

## v0.3.0
_2018-01-22_

 * #13 - Add more input selectors to match more login forms
 * #14 - Fix login forms built with React (specialised listeners) (ReactDOM)

## v0.2.0
_2018-01-19_

 * #5 - Add support for GitHub login
 * #6 - Prevent logging in to all inputs
 * #9 - Add integration test rig

## v0.1.1
_2017-12-18_

 * #2 - fix collection of forms that are not login forms

## v0.1.0
_2017-12-14_

First release:

 * Login form detection
 * Login automation
