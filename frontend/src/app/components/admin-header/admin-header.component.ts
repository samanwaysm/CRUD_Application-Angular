import { Component, Input , EventEmitter, Output} from '@angular/core';
import { Router,RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @Input() title!: string;
  @Output() search: EventEmitter<string> = new EventEmitter<string>;

  onChange(event: any){
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value.trim());
  }

  constructor(private router: Router){}
  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/adminlogin']);
  }
}
