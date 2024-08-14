import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from '../../../core/services/admin/food.service';
import { IFood } from '../../../core/models/food.model';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent implements OnInit {
  isFoodModalOpen = false
  isEditFoodModalOpen= false
  foodForm!: FormGroup
  editFoodForm!:FormGroup
  foods: IFood[] = []
  foodID!:string


  constructor(private navServices: AdminNavService, private fb: FormBuilder, private toastr: ToastrService, private foodService: FoodService) {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      pricePerPlate: ['', [Validators.required, Validators.min(1)]],
      section: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.editFoodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      pricePerPlate: ['', [Validators.required, Validators.min(1)]],
      section: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadFoods()
  }


  toggleSidebar() {
    this.navServices.toggleSidebar()
  }

  editFood(foodData: IFood,foodId:string) {
    this.foodID = foodId
    console.log(foodData,"hfdjsahkj",foodId); 
    this.isEditFoodModalOpen = true
    this.editFoodForm.patchValue(foodData);
    
  }

  openModal(target: string) {
    if (target == 'add') {
      this.isFoodModalOpen = true
    }
  }

  closeFoodModal() {
    this.isFoodModalOpen = false;
  }

  onSubmitFood() {
    if (this.foodForm.valid) {
      const foodData = this.foodForm.value;
      console.log(foodData);

      this.foodService.addFoods(foodData).subscribe(
        (response) => {
          console.log('Food item added successfully!', response);

          this.toastr.success('Food item added successfully!', 'Success');
          this.closeFoodModal();
          this.foodForm.reset();
        },
        (error) => {
          this.toastr.error('Failed to add food item. Please try again.', 'Error');
          console.error('Error adding food item:', error);
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }

  loadFoods() {
    this.foodService.getFood().subscribe(
      food => {
        this.foods = food;
      },
      error => {
        console.error(error);
      }
    );
  }

  closeEditFoodModal(){
   this.isEditFoodModalOpen = false
  }

  onSubmitEditFood() {
    if (this.editFoodForm.valid) {
      const foodData = this.editFoodForm.value;
  
      
      this.foodService.editFoods(foodData,this.foodID).subscribe(
        response => {
          console.log("Edit food data success", response);
          this.toastr.success('Food data updated successfully!', 'Success');
          this.closeEditFoodModal();
          this.loadFoods()
        },
        error => {
          console.error('Error updating food data', error);
          this.toastr.error('Failed to update food data. Please try again.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }


}
