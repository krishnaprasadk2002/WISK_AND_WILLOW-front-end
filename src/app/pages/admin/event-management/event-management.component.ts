import { Component } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/users/event.service';
import { IEvent } from '../../../core/models/event.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './event-management.component.html',
  styleUrl: './event-management.component.css'
})
export class EventManagementComponent {
  eventForm!: FormGroup;
  images = { image1: '', image2: '', image3: '' }
  events: IEvent[] = [];

  status: boolean = true;
  isSidebarOpen = false;
  isModalOpen = false;
  isEditModalOpen = false;
  isEditMode = false;
  imagePreview1: string | ArrayBuffer | null = null;
  imagePreview2: string | ArrayBuffer | null = null;
  imagePreview3: string | ArrayBuffer | null = null;
  currentEventId: string | null = null;



  constructor(private navservices: AdminNavService, private fb: FormBuilder, private eventService: EventService, private toastr: ToastrService) {
    this.navservices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen
    })
  }

  ngOnInit(): void {
    
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      image1: [null, Validators.required],
      event_heading: ['', [Validators.required, Validators.maxLength(100)]],
      event_content: ['', [Validators.required, Validators.maxLength(1000)]],
      image2: [null, Validators.required],
      event_services: ['', [Validators.required, Validators.maxLength(100)]],
      event_features: ['', [Validators.required, Validators.maxLength(1000)]],
      image3: [null, Validators.required],
    });

    this.loadEvents()
  }

  loadEvents() {
    this.eventService.getEvent().subscribe((event) => {
      this.events = event
    },
      (error) => {
        console.error('Error fetching events', error);
      })
  }

  toggleSidebar() {
    this.navservices.toggleSidebar()
  }

  eventStatus(event: IEvent) {
    event.status = !event.status;

    this.eventService.updateEventStatus(event).subscribe(
      () => {
        const message = event.status ? 'Event blocked successfully' : 'Event unblocked successfully';
        this.toastr.success(message);
        this.loadEvents();
      },
      error => {
        console.error('Error updating event status:', error);
        this.toastr.error('Failed to update event status');
        event.status = !event.status;
      }
    );
  }


  openModal(target:string) {
    if(target==="edit"){
      this.isEditModalOpen = true
    }else{
      this.isModalOpen = true;
    }
    
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditModalOpen = false
    this.resetPreviews();
    this.isEditMode = false;
    this.eventForm.reset();
  }

  // Function to handle image change

  onImageChange(event: Event, imageType: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log("image type", imageType);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        switch (imageType) {
          case 'image1':
            this.imagePreview1 = base64;
            this.images.image1 = this.imagePreview1
            break;
          case 'image2':
            this.imagePreview2 = base64;
            this.images.image2 = this.imagePreview2
            break;
          case 'image3':
            this.imagePreview3 = base64;
            this.images.image3 = this.imagePreview3
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

    if (this.eventForm.valid ) {
      const formData = { ...this.eventForm.value,...this.images }
      
      // Only include images that have been changed
      if (this.images.image1 !== this.imagePreview1) formData.image1 = this.images.image1;
      if (this.images.image2 !== this.imagePreview2) formData.image2 = this.images.image2;
      if (this.images.image3 !== this.imagePreview3) formData.image3 = this.images.image3;
      
      if (this.isEditMode && this.currentEventId) {
        console.log(this.isEditMode);
        this.eventService.updateEvent({ _id: this.currentEventId, ...formData }).subscribe(
          (response) => {
            this.isEditMode = false;
            this.eventForm.get('image1')?.addValidators(Validators.required);
            this.eventForm.get('image2')?.addValidators(Validators.required);
            this.eventForm.get('image3')?.addValidators(Validators.required);

            console.log('Event updated successfully', response);
            this.closeModal();
            this.loadEvents();
          },
          (error) => {
            this.isEditMode = false;
            this.eventForm.get('image1')?.addValidators(Validators.required);
            this.eventForm.get('image2')?.addValidators(Validators.required);
            this.eventForm.get('image3')?.addValidators(Validators.required);
            console.error('Error updating event', error);
          }
        );
      } else {
        //add new Event
        this.eventService.addEvent({ ...this.eventForm.value, ...this.images }).subscribe(
          (response) => {
            console.log('Event added successfully', response);
            this.closeModal();
            this.eventForm.reset();
            this.resetPreviews();
            this.loadEvents()
          },
          (error) => {
            console.error('Error adding event', error);
          }
        )
      }
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  editEvent(event: IEvent) {
    this.isEditMode = true
    this.eventForm.get('image1')?.removeValidators(Validators.required);
    this.eventForm.get('image2')?.removeValidators(Validators.required);
    this.eventForm.get('image3')?.removeValidators(Validators.required);

    this.currentEventId = event._id
    this.openModal("edit")
    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      event_heading: event.event_heading,
      event_content: event.event_content,
      event_services: event.event_services,
      event_features: event.event_features,
    });

    // Set image previews
    this.imagePreview1 = event.image1;
    this.imagePreview2 = event.image2;
    this.imagePreview3 = event.image3;

    // Set the images object for editing
    this.images = {
      image1: event.image1,
      image2: event.image2,
      image3: event.image3,
    };
  }
}
