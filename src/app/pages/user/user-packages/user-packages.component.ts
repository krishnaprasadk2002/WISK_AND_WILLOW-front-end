import { Component, OnInit } from '@angular/core';
import { Ipackages } from '../../../core/models/packages.model';
import { PackageService } from '../../../core/services/admin/package.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-packages',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-packages.component.html',
  styleUrl: './user-packages.component.css'
})
export class UserPackagesComponent implements OnInit {
  packages: Ipackages[] = [];
  paginatedPackages: Ipackages[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(private packageService: PackageService, private router: Router) {}

  ngOnInit(): void {
    this.getPackages();
  }

  getPackages(): void {
    this.packageService.getPackages().subscribe(
      (packages) => {
        this.packages = packages.map(pkg => ({ ...pkg, showFullDetails: false }));
        this.totalPages = Math.ceil(this.packages.length / this.itemsPerPage);
        this.updatePaginatedPackages(); 
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  updatePaginatedPackages(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPackages = this.packages.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPackages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPackages();
    }
  }

  getPackageSummary(packageItem: Ipackages): string {
    if (packageItem.packageItems && packageItem.packageItems.length > 0) {
      return packageItem.packageItems.slice(0, 3).map(item => item.itemName).join(', ') + '...';
    } else {
      return 'No items available';
    }
  }

  toggleDetails(pkg: Ipackages): void {
    pkg.showFullDetails = !pkg.showFullDetails;
  }
}