import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/users/event.service';
import { PackageService } from '../../../core/services/admin/package.service';
import { ToastrService } from 'ngx-toastr';
import { Ipackages } from '../../../core/models/packages.model';
import { Router } from '@angular/router';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,InputboxComponent,ButtonComponent,ModalComponent,AdminNavComponent],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent implements OnInit {
  packageForm!:FormGroup
  isModalOpen:Boolean = false
  eventNames:string[] = []
  packages:Ipackages[] = []
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private navServices:AdminNavService,private eventService:EventService,private fb:FormBuilder,private packageService:PackageService,private toastr:ToastrService,private router:Router){}


    ngOnInit(): void {
      this.packageForm = this.fb.group({
       name: ['', [Validators.required, Validators.maxLength(100)]],
       type_of_event: ['', [Validators.required, Validators.maxLength(100)]],
       startingAmount: ['', [Validators.required, Validators.min(0)]],
       image: [null] 
      })
   
       this.getEventName()
       this.getPackages()
     }

  openModal(target:string){
    if(target == 'add'){
    this.isModalOpen = true
    }
  }

getEventName(){
  this.eventService.getEvent().subscribe(
    (events) => {  
      this.eventNames = events.map(event => event.name);
    }
  );
}

  closeModal(){
    this.isModalOpen = false
    this.selectedImage = null;
    this.packageForm.reset();
  }

  getPackages(){
    this.packageService.getPackages().subscribe(
      (packagesData)=>{
        console.log(packagesData);
        this.packages = packagesData
      }
    )
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          this.selectedImage = result;
          this.packageForm.patchValue({
            image: this.selectedImage 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit() {
    if (this.packageForm.valid) {
      const packageData = this.packageForm.value;
      this.packageService.addPackages(packageData).subscribe(
        response => {
          console.log('Package added successfully', response);
          this.getPackages();
          this.toastr.success('Package added successfully!', 'Success'); 
          this.closeModal(); 
        },
        error => {
          console.error('Package adding failed', error);
          this.toastr.error('Failed to add package. Please try again.', 'Error'); 
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }

  openPackageDetails(PackageId:string){
    this.router.navigate(['/admin/package-details', PackageId]);
  }
}
