import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ipackages } from '../../../core/models/packages.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackageService } from '../../../core/services/admin/package.service';
import { IFood } from '../../../core/models/food.model';
import { IEvent } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/users/event.service';

interface CartItem {
  food: IFood;
  quantity: number;
}

interface FoodSection {
  name: string;
  foods: IFood[];
}

@Component({
  selector: 'app-specific-package',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './specific-package.component.html',
  styleUrl: './specific-package.component.css'
})
export class SpecificPackageComponent implements OnInit {
  packageName: string | null = null;
  packageDetails: Ipackages | null = null;
  foodSections: FoodSection[] = [];
  showFoodOptions: boolean = false;
  cart: CartItem[] = [];
  buttonEnabled: boolean = false;
 

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.packageName = this.route.snapshot.paramMap.get('name');
    this.loadPackageDetails();
  }

  loadPackageDetails() {
    if (this.packageName) {
      this.packageService.getPackageDetailsByName(this.packageName).subscribe(
        (data) => {
          this.packageDetails = data;
          this.loadFoods();
        },
        (error) => {
          console.error('Error fetching package details:', error);
        }
      );
    }
  }

  loadFoods() {
    this.packageService.getPackageFood().subscribe(
      (data) => {
        this.groupFoodsBySection(data);
        this.buttonEnabled = true;
      },
      (error) => {
        console.error('Food fetching error:', error);
      }
    );
  }

  groupFoodsBySection(foods: IFood[]) {
    this.foodSections = [
      { name: 'Welcome Drink', foods: foods.filter((food) => food.section === 'Welcome Drink') },
      { name: 'Main Food', foods: foods.filter((food) => food.section === 'Main Food') },
      { name: 'Dessert', foods: foods.filter((food) => food.section === 'Dessert') },
    ];
  }

  toggleFoodOptions() {
    this.showFoodOptions = !this.showFoodOptions;
  }

  addToCart(food: IFood) {
    const existingItem = this.cart.find((item) => item.food._id === food._id);
    const quantity = food.quantity && food.quantity > 0 ? food.quantity : 1;

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ food, quantity });
    }

    food.quantity = 1;
  }

  removeFromCart(food: IFood) {
    this.cart = this.cart.filter((item) => item.food._id !== food._id);
  }

  updateQuantity(food: IFood, quantity: number) {
    const existingItem = this.cart.find((item) => item.food._id === food._id);
    if (existingItem) {
      existingItem.quantity = Math.max(quantity, 1);
    }
  }

  getTotalAmount(): number {
    const foodTotal = this.cart.reduce((total, item) => total + item.food.pricePerPlate * item.quantity, 0);
    const packageTotal = this.packageDetails ? Number(this.packageDetails.startingAt) : 0;
    return foodTotal + packageTotal;
  }

  continueToBooking() {
    const totalAmount = this.getTotalAmount();
    sessionStorage.setItem('bookingData', JSON.stringify({
      packageDetails: this.packageDetails,
      cart: this.cart,
      totalAmount: totalAmount
    }));
    this.router.navigate(['/booking']);
  }


}