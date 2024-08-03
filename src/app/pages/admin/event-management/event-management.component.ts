import { Component } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/users/event.service';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './event-management.component.html',
  styleUrl: './event-management.component.css'
})
export class EventManagementComponent {
  eventForm!: FormGroup;

  status:boolean = true;
  isSidebarOpen = false;
  isModalOpen = false;
  imagePreview1: string | ArrayBuffer | null = null;
  imagePreview2: string | ArrayBuffer | null = null;
  imagePreview3: string | ArrayBuffer | null = null;

constructor(private navservices:AdminNavService,private fb:FormBuilder,private eventService:EventService){
  this.navservices.sidebarOpen$.subscribe(isOpen=>{
    this.isSidebarOpen = isOpen
  })
}

ngOnInit(): void {
  this.eventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(200)]],
    image1: [null, Validators.required],
    event_heading: ['', [Validators.required, Validators.maxLength(50)]],
    event_content: ['', [Validators.required, Validators.maxLength(200)]],
    image2: [null, Validators.required],
    event_services: ['', [Validators.required, Validators.maxLength(50)]],
    event_features: ['', [Validators.required, Validators.maxLength(200)]],
    image3: [null, Validators.required],
  });
}

toggleSidebar(){
  this.navservices.toggleSidebar()
}

toggleStatus(){
  this.status = !this.status
}

openModal(){
  this.isModalOpen = true
}

 closeModal(){
  this.isModalOpen = false
  this.resetPreviews();
 }

 // Function to handle image change
// Your component.ts file

onImageChange(event: Event, imageType: string) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Store the Base64 string and use it for uploading
      switch (imageType) {
        case 'image1':
          this.imagePreview1 = base64;
          this.eventForm.patchValue({ image1: base64 });
          break;
        case 'image2':
          this.imagePreview2 = base64;
          this.eventForm.patchValue({ image2: base64 });
          break;
        case 'image3':
          this.imagePreview3 = base64;
          this.eventForm.patchValue({ image3: base64 });
          break;
      }
    };
    reader.readAsDataURL(file);
  }
}


private resetPreviews() {
  this.imagePreview1 = null;
  this.imagePreview2 = null;
  this.imagePreview3 = null;
}

onSubmit(): void {
if(this.eventForm.valid){
this.eventService.addEvent(this.eventForm.value).subscribe(
  (response)=>{
    console.log('Event added successfully', response);
    this.closeModal();
    this.eventForm.reset();
    this.resetPreviews();
  },
  (error)=>{
    console.error('Error adding event', error);
  }
)
}else{
  this.eventForm.markAllAsTouched();
}
}
}
