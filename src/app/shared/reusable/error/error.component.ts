import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  errorCode!: number;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      this.errorCode = params.get('errorCode') as unknown as number
      console.log(this.errorCode);
      
    })
  }

  getTitle(): string {
    switch (this.errorCode) {
      case 403:
        return 'Forbidden';
      case 404:
        return 'Uh-oh!';
      case 500:
        return 'Server Error';
      default:
        return 'Error';
    }
  }

  getMessage(): string {
    switch (this.errorCode) {
      case 403:
        return "You don't have permission to access this page.";
      case 404:
        return "We can't find that page.";
      case 500:
        return 'Something went wrong on our end.';
      default:
        return 'An unexpected error occurred.';
    }
  }

}
