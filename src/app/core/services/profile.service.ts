import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AVATARS } from '../data/avatars.data'; // lista de avatares disponibles

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly avatarKey = 'selectedAvatar';

  // Guarda el id actual del avatar seleccionado
  private avatarSubject = new BehaviorSubject<string | null>(this.getStoredAvatar());
  avatar$ = this.avatarSubject.asObservable();

  saveAvatar(avatarId: string): void {
    localStorage.setItem(this.avatarKey, avatarId);
    this.avatarSubject.next(avatarId);
  }

  // Devuelve el ID guardado: 'harry', 'ron', etc.
  getAvatar(): string | null {
    return this.avatarSubject.value;
  }

  // Devuelve directamente la URL de la imagen del avatar
  getAvatarUrl(): string {
    const avatarId = this.getAvatar();
    const avatar = AVATARS.find(a => a.id === avatarId);

    // Si no encuentra ninguno, usa uno por defecto
    return avatar ? avatar.imageUrl : 'assets/avatars/Harry.png';
  }

  private getStoredAvatar(): string | null {
    return localStorage.getItem(this.avatarKey);
  }
}
