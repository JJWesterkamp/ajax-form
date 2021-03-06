import { AjaxFormConfig, IAjaxForm } from './ajax-form.types';
import { AjaxFormComponent } from './ajax-form.component';

export const create = (form: HTMLFormElement, config: AjaxFormConfig): IAjaxForm => {
    return new AjaxFormComponent(form, config);
};
