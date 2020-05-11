import { AjaxFormConfig, IAjaxForm } from '../laravel-ajax-form';
import { AjaxFormComponent } from './ajax-form.component';

export const debugConfig = (): AjaxFormConfig => {
    return {} as AjaxFormConfig;
}


export const AjaxForm = {

    create: (form: HTMLFormElement, config: AjaxFormConfig): IAjaxForm => {
        return new AjaxFormComponent(form, config);
    },
}
