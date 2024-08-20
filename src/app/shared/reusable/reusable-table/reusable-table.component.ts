import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReusableButtonsComponent } from '../reusable-buttons/reusable-buttons.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule,ReusableButtonsComponent,FormsModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css'
})
export class ReusableTableComponent {

@Input() HeadArray:any[] = []
@Input() GridArray:any[] = []
@Input() is_edit:boolean = false
@Input() is_info:boolean = false
@Input() is_status:boolean = false
@Input() is_delete:boolean = false
searchTerm: string = '';
@Input() currentPage: number = 1;
@Input() pageSize: number = 4;
@Input() totalItems: number = 0;

@Output() onEdit = new EventEmitter<any>();
@Output() onDelete = new EventEmitter<any>();
@Output() onStatus = new EventEmitter<any>();
@Output() onMoreInfo = new EventEmitter<any>();
@Output() searchChanged = new EventEmitter<any>()
@Output() pageChange = new EventEmitter<number>();

editRecord(item: any) {
  this.onEdit.emit({ item, id: item._id });
}

deleteRecord(item: any) {
  this.onDelete.emit(item);
}

showMoreInfo(item: any) {
  this.onMoreInfo.emit(item);
}

onStatusRecord(item:any){
  this.onStatus.emit(item)
  console.log(item);
  
}

onPageChange(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }
}

get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}

onSearchChange(value: string) {
  this.searchChanged.emit(value); 
}
}
