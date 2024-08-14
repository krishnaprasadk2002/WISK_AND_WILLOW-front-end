import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inputbox',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './inputbox.component.html',
  styleUrl: './inputbox.component.css'
})
export class InputboxComponent implements ControlValueAccessor {

  @Input() label:string = ''
  @Input() type:string = 'text'
  @Input() labelClass:string = ''
  @Input() inputClass:string = ''

  constructor(@Self() public ngControl:NgControl){
    this.ngControl.valueAccessor = this
  }

  get Control():FormControl{
    return this.ngControl.control as FormControl
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
