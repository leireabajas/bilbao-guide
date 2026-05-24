import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home';
import {ItineraryComponent} from './features/itinerary/itinerary';
import {PlacesComponent} from './features/places/places';
import {PassportComponent} from './features/passport/passport';
import {AvatarSelectorComponent} from './features/avatar-selector/avatar-selector';
import {PendingRequestsComponent} from './features/pending-requests/pending-requests';

// Fíjate en el punto y la barra al principio: ./

export const routes: Routes = [
  { path: '', redirectTo: 'avatar-selector', pathMatch: 'full' },
  { path: 'avatar-selector', component: AvatarSelectorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'itinerary', component: ItineraryComponent },
  { path: 'places', component: PlacesComponent },
  { path: 'passport', component: PassportComponent },
  {
    path: 'pending-requests',
    component: PendingRequestsComponent
  },
  { path: '**', redirectTo: 'avatar-selector' }
];
