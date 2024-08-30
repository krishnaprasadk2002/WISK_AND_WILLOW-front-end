import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-inputbox',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './inputbox.component.html',
  styleUrl: './inputbox.component.css'
})
export class InputboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() options: string[] | null = null;


  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  validate(): ValidationErrors | null {
    if (this.control && this.control.errors) {
      if (this.control.errors['whitespace']) {
        return { whitespace: true };
      }
    }
    return null;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
