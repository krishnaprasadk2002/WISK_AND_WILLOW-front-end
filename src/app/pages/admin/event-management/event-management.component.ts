import { Component, inject } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/users/event.service';
import { IEvent } from '../../../core/models/event.model';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormsModule,ButtonComponent,InputboxComponent,ModalComponent,AdminNavComponent,ReusableTableComponent],
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
  filteredEvent:IEvent[]=[];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  isLoading: boolean = false; 

  headArray:any[] = [
    { header: "EventName", fieldName: "name", datatype: "string" },
    // { header: "Description", fieldName: "description", datatype: "string" },
    { header: "Image", fieldName: "image1", datatype: "string" },
    { header: "Status", fieldName: "status", datatype: "boolean" }
  ]


  private toastService: ToastService = inject(ToastService); 


  constructor(private navservices: AdminNavService, private adminServices: AdminAuthService, private fb: FormBuilder, private eventService: EventService) {
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
    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
  
    this.adminServices.adminAllEvents(params).subscribe(
      (response: { event: IEvent[], totalItems: number }) => { 
        console.log('Response:', response); // Log the response
  
        // Ensure response.event is an array
        if (Array.isArray(response.event)) { 
          this.events = response.event;
          this.filteredEvent = [...this.events]; 
          this.totalItems = response.totalItems; 
        } else {
          console.error('Expected response.event to be an array');
          this.events = [];
          this.filteredEvent = [];
        }
        console.log('Filtered Events:', this.filteredEvent);
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }
  
  
  

  toggleSidebar() {
    this.navservices.toggleSidebar()
  }

  eventStatus(event: IEvent) {
    event.status = !event.status;

    this.eventService.updateEventStatus(event).subscribe(
      () => {
        const message = event.status ? 'Event blocked successfully' : 'Event unblocked successfully';
        this.toastService.showToast({ severity: 'success', summary: 'Success', detail: message });
        this.loadEvents();
      },
      error => {
        console.error('Error updating event status:', error);
        this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Failed to update event status' })
        event.status = !event.status;
      }
    );
  }


  openModal(target: string) {
    if (target === "edit") {
      this.isEditModalOpen = true
    } else {
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
    if (this.eventForm.valid) {
      this.isLoading = true; 
  
      const formData = { ...this.eventForm.value, ...this.images };
  
      
      if (this.images.image1 !== this.imagePreview1) formData.image1 = this.images.image1;
      if (this.images.image2 !== this.imagePreview2) formData.image2 = this.images.image2;
      if (this.images.image3 !== this.imagePreview3) formData.image3 = this.images.image3;
  
      if (this.isEditMode && this.currentEventId) {
        this.eventService.updateEvent({ _id: this.currentEventId, ...formData }).subscribe(
          (response) => {
            this.isEditMode = false;
            this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Event updated successfully' });
            this.closeModal();
            this.loadEvents();
          },
          (error) => {
            this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Error updating event' });
            console.error('Error updating event', error);
          },
          () => {
            this.isLoading = false;
          }
        );
      } else {
        this.eventService.addEvent({ ...this.eventForm.value, ...this.images }).subscribe(
          (response) => {
            this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Event added successfully' });
            this.closeModal();
            this.eventForm.reset();
            this.resetPreviews();
            this.loadEvents();
          },
          (error) => {
            this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Error adding event' });
          },
          () => {
            this.isLoading = false; 
          }
        );
      }
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
  

  editEvent(event: { item: IEvent; id: string }) {
    const eventData = event.item;
  
    console.log("Received event data:", eventData);
  
    if (!eventData) {
      console.error("Event data is undefined");
      return;
    }
  
    this.isEditMode = true;
  
    this.eventForm.get('image1')?.removeValidators(Validators.required);
    this.eventForm.get('image2')?.removeValidators(Validators.required);
    this.eventForm.get('image3')?.removeValidators(Validators.required);
  
    this.currentEventId = event.id;
  
    this.openModal("edit");

    this.eventForm.patchValue({
      name: eventData.name,
      description: eventData.description,
      event_heading: eventData.event_heading,
      event_content: eventData.event_content,
      event_services: eventData.event_services,
      event_features: eventData.event_features,
    });

    this.imagePreview1 = eventData.image1;
    this.imagePreview2 = eventData.image2;
    this.imagePreview3 = eventData.image3;
  
    this.images = {
      image1: eventData.image1,
      image2: eventData.image2,
      image3: eventData.image3,
    };
  
    console.log(this.eventForm.value);
  }
  
  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase()
    if(searchTerm){
      this.eventService.searchEvent(searchTerm).subscribe(
        item => {
          this.filteredEvent = item
        }, error => {
          console.error(error);
  
        }
      )
    }else{
     this.loadEvents()
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
  }
}
