import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  @Input() form: AbstractControl | null = null;
  @Input() feedbackId: string | null = null;

  constructor() {
  }

  isInvalid(): boolean {
    let invalid = false;

    if (this.form?.hasError('required') && this.form?.touched) {
      invalid = true;
    }

    if (this.form?.hasError('minlength') && this.form?.touched) {
      invalid = true;
    }

    return invalid;
  }
}
