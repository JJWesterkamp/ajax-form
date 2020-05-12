// ------------------------------------------------------------------------------
//      Type aliases
// ------------------------------------------------------------------------------

export type AjaxFormMethod = 'GET' | 'POST';
export type ErrorMessage = string;

// ------------------------------------------------------------------------------
//      Component interfaces
// ------------------------------------------------------------------------------

/**
 * Errors object to use for dynamic error display
 */
export interface AjaxFormErrors {
    [inputName: string]: ErrorMessage;
}

/**
 * The AjaxForm instance type.
 */
export interface IAjaxForm {

    readonly form: HTMLFormElement;

    readonly config: AjaxFormConfig;

    /**
     * Resumes the ajax-form interception of submit events.
     */
    resume(): void

    /**
     * Pauses the ajax-form interception of submit events. It might be required to schedule
     * the interception manually in some cases where other submission listeners must have
     * precedence over this one.
     */
    pause(): void
}

/**
 * Configuration object for AjaxForm instances. ALL methods are expected to be pure I/O
 * without requirements for `this`-binding in the method bodies.
 *
 * This object is intended to show AjaxForms how to interact with the DOM to update state,
 * and how to interpret server responses:
 *
 *      - How to find input elements
 *      - How to find error elements
 *      - How to insert error messages
 *      - How to clear error messages
 *      - Authorize, defer and/or modify submissions of the form (e.g. to hook in front-end
 *        validation / reCAPTCHA)
 *      - How to transform the server response for errors into a normalised interface
 */
export interface AjaxFormConfig {

    /**
     * The HTTP method to use for form submissions.
     */
    method: AjaxFormMethod;

    /**
     * The action (URL) for XHR submissions.
     */
    action: string;

    /**
     * OPTIONAL | Additional request headers to send with the requests.
     */
    requestHeaders?: { [key: string]: string };

    /**
     * Function to construct the CSS selector for the error element for given input name
     */
    inputElementSelector(inputName: string): string;

    /**
     * Function to construct the CSS selector for either all error elements in the form
     * if no input name is given. Otherwise must return the CSS selector for only the
     * error elements for given input name.
     */
    errorElementSelector(inputName?: string): string;

    /**
     * Function that transforms errors in a `ErrorResponse` into an `AjaxFormErrors` object
     * for the AjaxForm to process upon server-side validation errors.
     */
    transformErrorResponse(errorResponseBody: any): AjaxFormErrors;

    /**
     * Function that receives an error element (HTMLElement) and an error message (string)
     * and inserts the message into the element. The method might do other things in addition,
     * such as adding/removing classes to update the appearance of the form.
     */
    insertError(element: HTMLElement, message: string): void;

    /**
     * Function that decides how to clear an error message from the given error element.
     */
    clearError(element: HTMLElement): void;

    /**
     * OPTIONAL | Function that decides if the given form is allowed to be programmatically
     *            submitted by the AjaxForm instance. Receives the `FormData` reflecting the
     *            current form state as its first and only argument. This data can be decorated
     *            with additional computed data, such as a reCAPTCHA token or other data. Must
     *            return the FormData to send to the server, either plain, or as a promise.
     *            Return a rejected promise if the submission should be blocked for any reason.
     */
    prepareSubmit?(formData: FormData): FormData | Promise<FormData>;

    /**
     * OPTIONAL | Function to run in addition to the internal success handling (resetting
     *            form etc.) Receives the raw response as its first argument and the
     *            AjaxForm instance as its second.
     */
    handleSuccess?(successResponseBody: any, ajaxForm: IAjaxForm): void;

    /**
     * OPTIONAL | Function to run in addition to the internal error handling (displaying
     *            errors etc.) Receives the errors object as its first and only argument.
     */
    handleErrors?(errors: AjaxFormErrors): void;
}
