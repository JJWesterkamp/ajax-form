import axios, { AxiosError } from 'axios';
import { identity, noop } from './ajax-form.lib';
import { AjaxFormConfig, AjaxFormErrors, IAjaxForm } from './laravel-ajax-form.types';

export class AjaxFormComponent implements IAjaxForm {


    private readonly submitHandler = (event: Event) => {
        event.preventDefault();
        void this.submit();
    };


    constructor(
        public readonly form: HTMLFormElement,
        public readonly config: AjaxFormConfig,
    ) {
        this.resume();
    }

    // ------------------------------------------------------------------------------
    //      API methods
    // ------------------------------------------------------------------------------

    private _isIntercepting = false;
    public resume(): void {
        if (! this._isIntercepting) {
            this.form.addEventListener('submit', this.submitHandler);
            this._isIntercepting = true;
        }
    }

    public pause(): void {
        if (this._isIntercepting) {
            this.form.removeEventListener('submit', this.submitHandler);
            this._isIntercepting = false;
        }
    }


    // ------------------------------------------------------------------------------
    //      Implementation (protected)
    // ------------------------------------------------------------------------------

    /**
     * Attempts to submit the form with XHR. Lets the `prepareSubmit` function
     * from config decide whether the form may be submitted to the server, if defined.
     */
    protected async submit(): Promise<void> {

        this.clearErrors();

        try {
            const data = await (this.config.prepareSubmit || identity) (new FormData(this.form));

            await axios.post(this.config.action, data, {headers: this.config.requestHeaders}).then(
                (response) => this.handleSuccess(response.data),
                (error: AxiosError) => this.handleErrors(error.response && error.response.data || {}),

                // Todo: How best to account for HTTP errors other than 422?
            );

        } catch (err) {
            return;
        }
    }

    /**
     * Handles the HTTP success response. It'll first internally reset the form
     * fields state and clear any errors that are displayed, and then call
     * `handleSuccess` from config to perform additional user-defined tasks,
     * if defined.
     */
    protected handleSuccess(responseData: any): void {

        this.form.reset();
        this.clearErrors();

        (this.config.handleSuccess || noop) (responseData, this)
    }

    /**
     * Handles the HTTP error response. It'll first internally handle the insertion
     * of errors using template functions from config, and then call `handleErrors`
     * from config to perform additional user-defined tasks, if defined.
     */
    protected handleErrors(errorData: any): void {

        const transformedResponse = this.config.transformErrorResponse(errorData);
        this.displayErrors(transformedResponse);

        (this.config.handleErrors || noop) (transformedResponse)
    }

    /**
     * Displays the given AjaxFormErrors object in the DOM subtree of the form
     * element. Uses the `insertError` function from config to insert the error
     * text into the DOM.
     */
    protected displayErrors(errors: AjaxFormErrors): void {

        for (const [inputName, message] of Object.entries(errors)) {

            // Iterates a collection of elements to account for the possibility
            // of multiple elements (eg. 1 for desktop, another for mobile). All
            // elements must match the same selector for this to take effect.
            for (const element of this.getErrorElements(inputName)) {
                this.config.insertError(element, message);
            }
        }
    }

    /**
     * Clears all errors from the DOM subtree of the form. Uses the
     * `errorElementSelector` function (without input name) from config to obtain
     * the list of all error elements inside the form. Then uses `clearError` from
     * config to reset the error element's content / state.
     */
    protected clearErrors(): void {
        const selector = this.config.errorElementSelector();

        const elements = Array.from(
            this.form.querySelectorAll<HTMLElement>(selector)
        );

        for (const element of elements) {
            this.config.clearError(element);
        }
    }

    /**
     * Gets all error elements in the DOM subtree of the form matching the given
     * input name.
     */
    protected getErrorElements(inputName: string): HTMLElement[] {
        const selector = this.config.errorElementSelector(inputName);

        return Array.from(
            this.form.querySelectorAll<HTMLElement>(selector)
        );
    }
}
