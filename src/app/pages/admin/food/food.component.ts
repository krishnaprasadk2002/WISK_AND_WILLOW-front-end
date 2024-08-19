import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FoodService } from '../../../core/services/admin/food.service';
import { IFood } from '../../../core/models/food.model';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ButtonComponent,InputboxComponent,ModalComponent,AdminNavComponent,ReusableTableComponent],
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
  foodCategoryEnum:string[]=['Vegetarian','Non-vegetarian']
  foodSection:string[]=['Welcome Drink','Main Food','Dessert','Other']
  statusEnum:string[]=['Available','Not Available']
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  filteredFood:IFood[] = []
  headArray: any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Food Category", fieldName: "category", datatype: "string" },
    { header: "Price", fieldName: "pricePerPlate", datatype: "string" },
    { header: "Section", fieldName: "section", datatype: "string" },
    { header: "Status", fieldName: "status", datatype: "string" }

  ]


  constructor( private fb: FormBuilder, private toastr: ToastrService, private foodService: FoodService) {
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
  editFood(foodData: IFood, foodId: string) {
    this.foodID = foodData._id
    this.isEditFoodModalOpen = true;
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
          this.loadFoods()
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

  onSearchTermChanged(value:string){
    const searchTerm = value.toLowerCase()
    if(searchTerm){
      this.foodService.searchUsers(searchTerm).subscribe(
        item => {
          this.filteredFood = item
        }, error => {
          console.error(error);
        }
      )
    }else{
      this.filteredFood = this.foods
     
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFoods(this.currentPage)
  }


}
