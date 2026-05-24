import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Estado reactivo del modo admin
  private adminModeSubject = new BehaviorSubject<boolean>(false);

  // Observable público para que otros componentes escuchen cambios
  adminMode$ = this.adminModeSubject.asObservable();

  constructor() {
    // Recupera el estado guardado al arrancar la app
    const savedAdminMode = localStorage.getItem('adminMode');
    this.adminModeSubject.next(savedAdminMode === 'true');
  }

  /**
   * Activa el modo admin y lo guarda en localStorage
   */
  enableAdmin(): void {
    this.adminModeSubject.next(true);
    localStorage.setItem('adminMode', 'true');
  }

  /**
   * Desactiva el modo admin y lo guarda en localStorage
   */
  disableAdmin(): void {
    this.adminModeSubject.next(false);
    localStorage.setItem('adminMode', 'false');
  }

  /**
   * Devuelve el valor actual del modo admin
   */
  isAdmin(): boolean {
    return this.adminModeSubject.value;
  }
}
