import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/widgets/navbar/navbar.component';
import { FooterComponent } from './shared/widgets/footer/footer.component';
import { HomeComponent } from './pages/user/home/home.component';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ToastService } from './services/toast.service';
import IToastOption from './core/models/IToastOptions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WISKANDWILLOW-front_end';

  private toastService: ToastService = inject(ToastService);
  private messageService: MessageService = inject(MessageService);
  private toastOptionSubscription: Subscription | undefined; // for later unsubcribing variable is needed
  
  constructor() {}

  ngOnInit(): void {
    this.toastOptionSubscription = this.toastService.toastOption$.subscribe(
      (toastOption: IToastOption) => {
        this.messageService.add(toastOption);
      },
      (err: any) => {
        console.error(err, 'toast');
      }
    );
  }

  ngOnDestroy(): void {
    this.toastOptionSubscription?.unsubscribe(); // unsubscribe to avoid memory leaks
  }
}
