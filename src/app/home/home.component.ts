import { Component, OnInit } from '@angular/core';
import { ApiService, Energy } from '../api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  energies: Observable<Energy[]>;

  constructor(private apiService: ApiService) {
    this.energies = apiService.getAllUsage();
  }

  ngOnInit(): void {
  }

}
