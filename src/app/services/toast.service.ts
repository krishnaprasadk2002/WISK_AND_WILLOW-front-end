import { Injectable } from '@angular/core';


export const TOAST_STATE = {  
  success: 'success-toast',  
  warning: 'warning-toast',  
  danger: 'danger-toast'
};

@Injectable({  
  providedIn: 'root'
})

export class ToastService {  
  constructor() { }
}