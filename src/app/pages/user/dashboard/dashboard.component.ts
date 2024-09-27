import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IEvent } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/users/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IBanner } from '../../../core/models/banner.model';
import KeenSlider, { KeenSliderInstance } from "keen-slider"
import { trigger, state, style, animate, transition } from '@angular/animations';

interface FAQ {
  question: string;
  answer: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ],
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  events: IEvent[] = [];
  isLoading: boolean = true;
  banners: IBanner[] = [];
  isBannerLoading = true;
  bannerSliderInitialized = false;
  eventSliderInitialized = false;
  faqs: FAQ[] = [];

  @ViewChild('sliderRef') sliderRef: ElementRef<HTMLElement> | undefined;
  @ViewChild('eventsSliderRef') eventsSliderRef: ElementRef<HTMLElement> | undefined;
  bannerSlider: KeenSliderInstance | null = null;
  eventSlider: KeenSliderInstance | null = null;

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadBanners();
    this.loadFAQs();
  }

  ngAfterViewChecked() {
    if (!this.bannerSliderInitialized && !this.isBannerLoading && this.banners.length > 0 && this.sliderRef) {
      this.initializeBannerSlider();
      this.bannerSliderInitialized = true;
      this.cdr.detectChanges();
    }

    if (!this.eventSliderInitialized && !this.isLoading && this.events.length > 0 && this.eventsSliderRef) {
      this.initializeEventSlider();
      this.eventSliderInitialized = true;
      this.cdr.detectChanges();
    }
  }

  loadEvents(): void {
    this.eventService.getEvent().subscribe(
      (events: IEvent[]) => {
        this.events = events;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error: any) => console.error('Error fetching events', error)
    );
  }

  loadBanners(): void {
    this.eventService.getBanners().subscribe(
      (banners: IBanner[]) => {
        this.banners = banners;
        this.isBannerLoading = false;
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching banners', error);
        this.isBannerLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  private initializeBannerSlider(): void {
    if (this.sliderRef?.nativeElement && this.banners.length > 0 && !this.bannerSlider) {
      this.bannerSlider = new KeenSlider(
        this.sliderRef.nativeElement,
        {
          loop: true,
          slides: {
            perView: 1,
            spacing: 10,
          },
          initial: 0,
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

  private initializeEventSlider(): void {
    if (this.eventsSliderRef?.nativeElement && this.events.length > 0 && !this.eventSlider) {
      this.eventSlider = new KeenSlider(
        this.eventsSliderRef.nativeElement,
        {
          loop: true,
          slides: {
            perView: 3,
            spacing: 16,
          },
          breakpoints: {
            '(max-width: 768px)': {
              slides: {
                perView: 1,
                spacing: 10
              },
            },
            '(max-width: 1024px)': {
              slides: {
                perView: 2,
                spacing: 16
              },
            },
            '(min-width: 1025px)': {
              slides: {
                perView: 3,
                spacing: 16
              },
            },
          },
        }
      );
    }
  }
  

  nextEventSlide() {
    this.eventSlider?.next();
  }

  prevEventSlide() {
    this.eventSlider?.prev();
  }

  loadFAQs(): void {
    this.faqs = [
      {
        question: "What is your event management service?",
        answer: "We offer comprehensive event management services, including planning, coordination, and execution of all types of events such as weddings, corporate events, and social gatherings.",
        isExpanded: false
      },
      {
        question: "How can I book an event?",
        answer: "You can easily book an event by contacting us through our website or by calling our customer service. We'll guide you through the process and help you select the best package for your needs.",
        isExpanded: false
      },
      {
        question: "What types of events do you handle?",
        answer: "We manage various events including weddings, corporate meetings, conferences, social gatherings, and custom events tailored to your specific requirements.",
        isExpanded: false
      },
      {
        question: "Do you provide custom event packages?",
        answer: "Yes, we offer customizable event packages to suit your preferences, budget, and event type. Our team will work with you to create a package that perfectly fits your vision.",
        isExpanded: false
      },
      {
        question: "What is included in your event packages?",
        answer: "Our event packages include venue setup, catering, entertainment, decorations, and event coordination. You can also add additional features based on your needs.",
        isExpanded: false
      }
    ];
  }

  ngOnDestroy() {
    if (this.bannerSlider) this.bannerSlider.destroy();
    if (this.eventSlider) this.eventSlider.destroy();
  }

  toggleFAQ(faq: FAQ): void {
    faq.isExpanded = !faq.isExpanded;
  }

}