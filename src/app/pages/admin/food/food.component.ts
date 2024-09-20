import { Component, inject, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { FoodService } from '../../../core/services/admin/food.service';
import { IFood } from '../../../core/models/food.model';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { noWhitespaceValidator } from '../../../shared/validators/form.validator';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ButtonComponent,InputboxComponent,ModalComponent,AdminNavComponent,ReusableTableComponent],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent implements OnInit {
  isFoodModalOpen = false;
  isEditFoodModalOpen = false;
  foodForm!: FormGroup;
  editFoodForm!: FormGroup;
  foods: IFood[] = [];
  foodID!: string;
  foodCategoryEnum: string[] = ['Vegetarian', 'Non-vegetarian'];
  foodSection: string[] = ['Welcome Drink', 'Main Food', 'Dessert'];
  statusEnum: string[] = ['Available', 'Not Available'];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  filteredFood: IFood[] = [];
  headArray: any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Food Category", fieldName: "category", datatype: "string" },
    { header: "Price", fieldName: "pricePerPlate", datatype: "string" },
    { header: "Section", fieldName: "section", datatype: "string" },
    { header: "Status", fieldName: "status", datatype: "string" }
  ];

  private toastService: ToastService = inject(ToastService); 

  constructor(private fb: FormBuilder, private foodService: FoodService) {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]],
      category: ['', Validators.required],
      pricePerPlate: ['', [Validators.required, Validators.min(1)]],
      section: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.editFoodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]],
      category: ['', Validators.required],
      pricePerPlate: ['', [Validators.required, Validators.min(1)]],
      section: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFoods();
  }

  editFood(foodData: IFood, foodId: string) {
    this.foodID = foodData._id;
    this.isEditFoodModalOpen = true;
    this.editFoodForm.patchValue(foodData);
  }

  openModal(target: string) {
    if (target === 'add') {
      this.isFoodModalOpen = true;
      this.foodForm.reset();
    }
  }

  closeFoodModal() {
    this.isFoodModalOpen = false;
    this.foodForm.reset(); 
  }

  onSubmitFood() {
    if (this.foodForm.valid) {
      const foodData = this.foodForm.value;
  
      this.foodService.addFoods(foodData).subscribe(
        response => {
          this.toastService.showToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Food item added successfully!',
          });
          this.closeFoodModal();
  
          if (this.totalItems < this.itemsPerPage * this.currentPage) {
            this.foods.push(response);
            this.filteredFood = [...this.foods];
          } else {
            this.loadFoods(this.currentPage);
          }
        },
        error => {
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add food item. Please try again.',
          });
          console.error('Error adding food item:', error);
        }
      );
    } else {
      this.toastService.showToast({
        severity: 'warning',
        summary: 'Warning',
        detail: 'Please fill out the form correctly.',
      });
    }
  }

  loadFoods(page: number = this.currentPage): void {
    this.foodService.getFood(page, this.itemsPerPage).subscribe(
      data => {
        this.foods = data.foods;
        this.filteredFood = this.foods;
        this.totalItems = data.totalItems;
      },
      error => {
        console.error(error);
      }
    );
  }
  
  closeEditFoodModal() {
    this.isEditFoodModalOpen = false;
  }

  onSubmitEditFood() {
    if (this.editFoodForm.valid) {
      const foodData = this.editFoodForm.value;

      this.foodService.editFoods(foodData, this.foodID).subscribe(
        response => {
          this.toastService.showToast({
            severity: 'success',
            summary: 'Success',
            detail: 'Food data updated successfully!',
          });
          this.closeEditFoodModal();

          if (this.foods.length > 4) {
            this.loadFoods();
          } else {
            const index = this.foods.findIndex(item => item._id === this.foodID);
            if (index > -1) {
              this.foods[index] = response; 
              this.filteredFood = [...this.foods]; 
            }
          }
        },
        error => {
          console.error('Error updating food data', error);
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update food data. Please try again.',
          });
        }
      );
    } else {
      this.toastService.showToast({
        severity: 'warning',
        summary: 'Warning',
        detail: 'Please fill out the form correctly.',
      });
    }
  }

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase();
    if (searchTerm) {
      this.foodService.searchUsers(searchTerm).subscribe(
        item => {
          this.filteredFood = item;
        }, 
        error => {
          console.error(error);
        }
      );
    } else {
      this.filteredFood = this.foods;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFoods(this.currentPage);
  }
}