import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { ITINERARY_DAYS } from '../../core/data/itinerary.data';
import { ItineraryDayItem } from '../../core/models/itinerary.model';
import { PLACES } from '../../core/data/places.data';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './itinerary.html',
  styleUrl: './itinerary.scss'
})
export class ItineraryComponent {
  tripDays: ItineraryDayItem[] = ITINERARY_DAYS;

  constructor(private router: Router) {}

  openDayOnMap(dayPlaces: string[]): void {
    localStorage.setItem('itinerarySelectedPlaces', JSON.stringify(dayPlaces));
    this.router.navigate(['/places']);
  }

  getPlaceNameById(placeId: string): string {
    const place = PLACES.find(p => p.id === placeId);
    return place ? place.name : placeId;
  }
}
