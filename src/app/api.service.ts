import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ENERGY_API_URL } from '../global';


export interface Energy {
  year: number;
  consume: {
    total: number;
    day: number;
    night: number;
  };
  generate: {
    total: number;
    day: number;
    night: number;
  };
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private energies = new BehaviorSubject<Energy[]>(null);

  constructor(private http: HttpClient) {
  }

  getAllUsage(): BehaviorSubject<Energy[]> {
    const url = `${ENERGY_API_URL}`;

    this.http.get<Energy[]>(url, {headers: {Accept: 'application/json'}})
      .subscribe(
        (energies) => {
          console.log(energies);

          this.energies.next(energies);
        },
        errors => console.log(errors.error.title)
      );

    return this.energies;
  }
}
