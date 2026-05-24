import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, filter } from 'rxjs';

import { ProfileService } from './core/services/profile.service';
import { AdminService } from './core/services/admin.service';
import {AuthService} from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Bilbao Guide';
  avatarUrl: string = 'assets/avatars/default.png';

  // Controla si la pestaña de pendientes debe verse o no
  isAdminMode = false;

  // Subtítulo dinámico para el header
  currentSubtitle = 'Tu viaje empieza aquí';

  // Guardamos las suscripciones para limpiarlas al destruir el componente
  private avatarSubscription?: Subscription;
  private adminSubscription?: Subscription;
  private routerSubscription?: Subscription;


  constructor(
    private profileService: ProfileService,
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Cargamos avatar inicial
    this.avatarUrl = this.profileService.getAvatarUrl();

    // Escucha cambios del avatar seleccionado
    this.avatarSubscription = this.profileService.avatar$.subscribe(() => {
      this.avatarUrl = this.profileService.getAvatarUrl();
    });

    // Escucha cambios del modo admin en tiempo real
    this.adminSubscription = this.adminService.adminMode$.subscribe((isAdmin) => {
      this.isAdminMode = isAdmin;
    });

    // Subtítulo inicial según ruta actual
    this.updateSubtitle(this.router.url);

    // Escucha cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.updateSubtitle(nav.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.avatarSubscription?.unsubscribe();
    this.adminSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  private updateSubtitle(url: string): void {
    if (url.includes('/home')) {
      this.currentSubtitle = 'Tu viaje empieza aquí';
      return;
    }

    if (url.includes('/itinerary')) {
      this.currentSubtitle = 'El plan del recorrido';
      return;
    }

    if (url.includes('/places')) {
      this.currentSubtitle = 'Explora y desbloquea lugares';
      return;
    }

    if (url.includes('/passport')) {
      this.currentSubtitle = 'Tu progreso del viaje';
      return;
    }

    if (url.includes('/pending-requests')) {
      this.currentSubtitle = 'Panel de validación';
      return;
    }

    if (url.includes('/avatar-selector')) {
      this.currentSubtitle = 'Elige tu compañera de viaje';
      return;
    }

    this.currentSubtitle = 'Tu aventura en Bilbao';
  }
}
