import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ReusableButtonsComponent } from '../reusable-buttons/reusable-buttons.component';
import { FormsModule } from '@angular/forms';
import { debounce, debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule,ReusableButtonsComponent,FormsModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css'
})
export class ReusableTableComponent implements OnDestroy {

@Input() HeadArray:any[] = []
@Input() GridArray:any[] = []
@Input() is_edit:boolean = false
@Input() is_info:boolean = false
@Input() is_status:boolean = false
@Input() is_delete:boolean = false
@Input() is_assign: boolean = false; 
searchTerm: string = '';
@Input() currentPage: number = 1;
@Input() pageSize: number = 4;
@Input() totalItems: number = 0;
@Input() is_ApproveReject: boolean = false;


@Output() onEdit = new EventEmitter<any>();
@Output() onDelete = new EventEmitter<any>();
@Output() onStatus = new EventEmitter<any>();
@Output() onMoreInfo = new EventEmitter<any>();
@Output() searchChanged = new EventEmitter<any>()
@Output() pageChange = new EventEmitter<number>();
@Output() onAssign = new EventEmitter<any>();
@Output() onApproveReject = new EventEmitter<any>()

private searchSubject = new Subject<string>()
private searchSubscription: Subscription | undefined;

constructor(){
  this.searchSubject.pipe(
    debounceTime(300)
  ).subscribe(searchTerm =>{
    this.searchChanged.emit(searchTerm)
  })
}

trackByHeader(index: number, header: any): any {
  return header.header;
}

trackByData(index: number, data: any): any {
  return data._id;
}

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
  this.searchSubject.next(value); 
}

ngOnDestroy() {
  if (this.searchSubscription) {
    this.searchSubscription.unsubscribe();
  }
}
getPages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

assignRecord(item: any) {
  this.onAssign.emit(item);
}

updateEmplyeeStatus(item:any){
  this.onApproveReject.emit(item)
}


}
