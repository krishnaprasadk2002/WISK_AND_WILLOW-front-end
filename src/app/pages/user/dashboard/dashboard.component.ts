import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IEvent } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/users/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IBanner } from '../../../core/models/banner.model';
import KeenSlider, { KeenSliderInstance } from "keen-slider"


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit,AfterViewInit {
  events: IEvent[] = [];
  isLoding: boolean = true;
  banners: IBanner[] = [];
  isBannerLoading = true;

  @ViewChild('sliderRef') sliderRef: ElementRef<HTMLElement> | undefined;
  slider: KeenSliderInstance | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadBanners();
  }

  loadEvents(): void {
    this.eventService.getEvent().subscribe(
      (events: IEvent[]) => {
        this.events = events;
        this.isLoding = false;
      },
      (error: any) => console.error('Error fetching events', error)
    );
  }

  loadBanners(): void {
    this.eventService.getBanners().subscribe(
      (banners: IBanner[]) => {
        this.banners = banners;
        this.isBannerLoading = false;
      },
      (error: any) => {
        console.error('Error fetching banners', error);
        this.isBannerLoading = false;
      }
    );
  }

  ngAfterViewInit() {
    if (this.sliderRef?.nativeElement) {
      this.slider = new KeenSlider(
        this.sliderRef.nativeElement,
        {
          loop: true,
          slides: {
            perView: 1,
            spacing: 10, 
          },
        },
        [
          (slider) => {
            let timeout: any;
            let mouseOver = false;

            const clearNextTimeout = () => clearTimeout(timeout);

            const nextTimeout = () => {
              clearTimeout(timeout);
              if (mouseOver) return;
              timeout = setTimeout(() => {
                if(slider?.next) {

                  slider.next();
                }
              }, 2000); 
            };

            slider.on("created", () => {
              slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });

            slider.on("dragStarted", clearNextTimeout);
            slider.on("animationEnded", nextTimeout);
            slider.on("updated", nextTimeout);
          },
        ]
      );
    }
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy();
  }
}