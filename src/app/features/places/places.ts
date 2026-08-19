import { Component, AfterViewInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import * as L from 'leaflet';
import { AVATARS } from '../../core/data/avatars.data';
import { PLACES } from '../../core/data/places.data';
import { ProfileService } from '../../core/services/profile.service';
import { AdminService } from '../../core/services/admin.service';




import {AuthService} from '../../core/services/auth';
import {PlacePhoto, PlacePhotoService} from '../../core/services/place-photo';
import {PlaceProgressService} from '../../core/services/place-progress';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  templateUrl: './places.html',
  styleUrl: './places.scss'
})
export class PlacesComponent implements AfterViewInit, OnDestroy {
  // Instancia del mapa
  // Distancia máxima para desbloquear un lugar (en metros)
  // Durante pruebas puedes poner 300 o 500
  // En uso real, algo como 80, 100 o 120 funciona mejor
  private readonly unlockDistance = 120;
  private map: any;
  private readonly placeAlbumsKey = 'placePhotoAlbums';
  selectedPlacePhotos: PlacePhoto[] = [];


  // Lista de marcadores de lugares
  private markers: L.Marker[] = [];

  // Marcador de la usuaria
  private userMarker: L.Marker | null = null;

  // ID del seguimiento GPS
  private watchId: number | null = null;

  // Lugar actualmente seleccionado para mostrar su ficha
  selectedPlace: any = null;
  selectedItineraryPlaces: string[] = [];

  // Estado del modo administrador
  isAdminMode = false;

  // Muestra el modal para introducir contraseña
  showPasswordInput = false;

  // Guarda la contraseña escrita
  enteredPassword = '';

  // Muestra el mensaje de acceso concedido
  showSuccessMessage = false;

  // Muestra el mensaje de error cuando la contraseña falla
  showErrorMessage = false;

  // Modal general para mensajes del mapa
  showStatusMessage = false;

  // Título del mensaje mostrado en el modal
  statusMessageTitle = '';

  // Texto principal del mensaje mostrado en el modal
  statusMessageText = '';

  // Tipo visual del mensaje: éxito, error o aviso
  statusMessageType: 'success' | 'error' | 'info' = 'info';

  // Muestra la confirmación bonita de admin
  showAdminConfirm = false;

  // Lugar pendiente de bloquear/desbloquear
  pendingPlace: any = null;

  // Acción pendiente: desbloquear o bloquear
  pendingAction: 'unlock' | 'lock' | null = null;

  // Lista de lugares del mapa
  places = PLACES.map(place => ({ ...place }));

  showPhotoViewer = false;
  selectedPhotoView: string | null = null;
  selectedPhotoIndex = 0;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
    private adminService: AdminService,
    private authService: AuthService,
    private placePhotoService: PlacePhotoService,
    private placeProgressService: PlaceProgressService
  ) {}

  ngAfterViewInit(): void {

    this.isAdminMode = this.adminService.isAdmin();

    this.loadItineraryPlacesFilter();

    this.initMap();

    this.trackUser();

    this.loadProgress();

  }

  ngOnDestroy(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  // --- MEMORIA DEL JUEGO ---
  async saveProgress(): Promise<void> {

    try {

      const userId = await this.authService.getUserIdAsync();

      const unlockedPlaceIds = this.places
        .filter(place => !place.locked)
        .map(place => place.id);

      await this.placeProgressService.saveUnlockedPlaces(
        userId,
        unlockedPlaceIds
      );

    } catch (error) {

      console.error(
        'Error guardando lugares desbloqueados:',
        error
      );

    }
  }

  // Carga los lugares desbloqueados guardados anteriormente
  async loadProgress(): Promise<void> {

    try {

      const userId = await this.authService.getUserIdAsync();

      const unlockedPlaceIds =
        await this.placeProgressService.getUnlockedPlaces(userId);

      this.places.forEach(place => {
        place.locked = !unlockedPlaceIds.includes(place.id);
      });

      this.updateMarkers();
      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        'Error cargando lugares desbloqueados:',
        error
      );

    }
  }
  openPhotoViewer(photo: PlacePhoto): void {
    this.selectedPhotoIndex = this.selectedPlacePhotos.findIndex(p => p.id === photo.id);
    this.selectedPhotoView = photo.url;
    this.showPhotoViewer = true;
    this.cdr.detectChanges();
  }

  closePhotoViewer(): void {
    this.selectedPhotoView = null;
    this.showPhotoViewer = false;
    this.selectedPhotoIndex = 0;
    this.cdr.detectChanges();
  }

  showPreviousPhoto(): void {
    if (this.selectedPlacePhotos.length === 0) return;

    this.selectedPhotoIndex =
      this.selectedPhotoIndex === 0
        ? this.selectedPlacePhotos.length - 1
        : this.selectedPhotoIndex - 1;

    this.selectedPhotoView = this.selectedPlacePhotos[this.selectedPhotoIndex].url;
    this.cdr.detectChanges();
  }

  showNextPhoto(): void {
    if (this.selectedPlacePhotos.length === 0) return;

    this.selectedPhotoIndex =
      this.selectedPhotoIndex === this.selectedPlacePhotos.length - 1
        ? 0
        : this.selectedPhotoIndex + 1;

    this.selectedPhotoView = this.selectedPlacePhotos[this.selectedPhotoIndex].url;
    this.cdr.detectChanges();
  }

  // --- MODO ADMIN ---
  // Se ejecuta al tocar el interruptor de admin
  // Se ejecuta al tocar el interruptor de admin
  toggleAdminMode(event: any) {
    if (event.checked) {
      // Muestra el modal de contraseña
      this.showPasswordInput = true;

      // Dejamos el switch apagado hasta validar bien
      event.source.checked = false;
    } else {
      // Si se apaga, desactivamos admin también a nivel global
      this.isAdminMode = false;
      this.adminService.disableAdmin();
      this.updateMarkers();
    }
  }

  private currentUserLatLng: L.LatLng | null = null;

  private loadItineraryPlacesFilter(): void {
    const data = localStorage.getItem('itinerarySelectedPlaces');

    if (!data) {
      this.selectedItineraryPlaces = [];
      return;
    }

    try {
      this.selectedItineraryPlaces = JSON.parse(data);
    } catch (error) {

      this.selectedItineraryPlaces = [];
    }
  }
// Comprueba la contraseña del modo admin
  checkPassword() {
    if (this.enteredPassword === 'bilbao') {
      // Contraseña correcta: activamos admin
      this.isAdminMode = true;
      this.adminService.enableAdmin();
      this.showSuccessMessage = true;
    } else {
      // Contraseña incorrecta: mantenemos admin apagado
      this.isAdminMode = false;
      this.adminService.disableAdmin();
      this.showErrorMessage = true;
    }

    // Limpiamos el campo y cerramos el modal de contraseña
    this.enteredPassword = '';
    this.showPasswordInput = false;

    this.updateMarkers();
  }

  // Cierra el mensaje de éxito
  closeSuccessMessage() {
    this.showSuccessMessage = false;
  }

  // Cierra el mensaje de error
  closeErrorMessage() {
    this.showErrorMessage = false;
  }

  // Abre un modal general con mensajes del mapa
  openStatusMessage(
    title: string,
    text: string,
    type: 'success' | 'error' | 'info'
  ): void {
    this.statusMessageTitle = title;
    this.statusMessageText = text;
    this.statusMessageType = type;
    this.showStatusMessage = true;
  }

  // Cierra el modal general de mensajes
  closeStatusMessage(): void {
    this.showStatusMessage = false;
    this.statusMessageTitle = '';
    this.statusMessageText = '';
    this.statusMessageType = 'info';
  }

  // Cancela la introducción de contraseña
  cancelPassword() {
    this.enteredPassword = '';
    this.showPasswordInput = false;
    this.isAdminMode = false;
    this.adminService.disableAdmin();
    this.updateMarkers();
  }

// Abre la ventana de confirmación para una acción admin
  openAdminConfirm(place: any, action: 'unlock' | 'lock') {
    this.pendingPlace = place;
    this.pendingAction = action;
    this.showAdminConfirm = true;

    // Forzamos refresco de la vista
    this.cdr.detectChanges();
  }

  // Cancela la acción admin
  cancelAdminConfirm() {
    this.pendingPlace = null;
    this.pendingAction = null;
    this.showAdminConfirm = false;
  }

  // Confirma la acción admin sobre un lugar
  confirmAdminAction() {
    if (!this.pendingPlace || !this.pendingAction) return;

    if (this.pendingAction === 'unlock') {
      this.pendingPlace.locked = false;
    }

    if (this.pendingAction === 'lock') {
      this.pendingPlace.locked = true;
      this.selectedPlace = null;
      this.cdr.detectChanges();
    }

    this.saveProgress();
    this.updateMarkers();

    this.pendingPlace = null;
    this.pendingAction = null;
    this.showAdminConfirm = false;
  }

  // Cierra la tarjeta del lugar
  closeCard() {
    this.selectedPlace = null;
    this.selectedPlacePhotos = [];
    this.cdr.detectChanges();
  }

  clearItineraryFilter(): void {
    localStorage.removeItem('itinerarySelectedPlaces');
    this.selectedItineraryPlaces = [];
    this.updateMarkers();
  }


  // --- AVATAR / POSICIÓN ---
  // Sigue la posición de la usuaria y la pinta en el mapa
  trackUser() {
    if (!navigator.geolocation) return;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.currentUserLatLng = L.latLng(lat, lng);
        this.checkNearbyPlaces(lat, lng);

        if (!this.userMarker) {
          // La primera vez, centramos el mapa en la usuaria
          this.map.setView([lat, lng], 16, { animate: true });

          // Recuperamos el avatar guardado
          const avatarId = this.profileService.getAvatar();
          const avatar = AVATARS.find(a => a.id === avatarId);

          // Avatar por defecto si no encuentra ninguno
          const avatarUrl = avatar ? avatar.imageUrl : 'assets/avatars/Harry.png';

          const userIcon = L.divIcon({
            html: `<div class="user-marker-icon"><img src="${avatarUrl}" alt="avatar"></div>`,
            className: '',
            iconSize: [56, 56],
            iconAnchor: [28, 28]
          });

          this.userMarker = L.marker([lat, lng], {
            icon: userIcon,
            zIndexOffset: 1000
          }).addTo(this.map);
        } else {
          // Si ya existe, solo actualizamos la posición
          this.userMarker.setLatLng([lat, lng]);
        }
      },
      undefined,
      { enableHighAccuracy: true }
    );
  }

  // --- MAPA ---
  // Inicializa el mapa y sus capas
  private initMap(): void {
    this.map = L.map('map', { zoomControl: false }).setView([43.2630, -2.9350], 14);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '' }
    ).addTo(this.map);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { attribution: '' }
    ).addTo(this.map);

    this.updateMarkers();

    // Cierra la ficha si se toca el fondo del mapa
    this.map.on('click', () => {
      this.zone.run(() => {
        this.selectedPlace = null;
        this.cdr.detectChanges();
      });
    });
  }

  centerOnUser(): void {
    if (this.currentUserLatLng) {
      this.selectedPlace = null;
      this.map.setView(this.currentUserLatLng, 17, { animate: true });
      this.cdr.detectChanges();
      return;
    }

    if (!navigator.geolocation) {
      this.openStatusMessage(
        'Ubicación no disponible',
        'Este dispositivo no permite obtener tu posición actual.',
        'error'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.currentUserLatLng = L.latLng(lat, lng);
        this.selectedPlace = null;
        this.map.setView(this.currentUserLatLng, 17, { animate: true });
        this.cdr.detectChanges();
      },
      () => {
        this.openStatusMessage(
          'Ubicación no disponible',
          'No se ha podido centrar el mapa en tu posición.',
          'error'
        );
      }
    );
  }

  private checkNearbyPlaces(lat: number, lng: number): void {
    let unlocked = false;

    this.places.forEach(place => {
      if (place.locked) {
        const dist = L.latLng(lat, lng)
          .distanceTo(L.latLng(place.location.lat, place.location.lng));

        if (dist < this.unlockDistance) {
          place.locked = false;
          unlocked = true;
        }
      }
    });

    if (unlocked) {
      this.saveProgress();
      this.updateMarkers();

      this.openStatusMessage(
        'Sitio registrado',
        'Has desbloqueado un lugar automáticamente.',
        'success'
      );
    }
  }
  private getPhotoAlbums(): Record<string, string[]> {
    const data = localStorage.getItem(this.placeAlbumsKey);

    if (!data) {
      return {};
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo placePhotoAlbums:', error);
      return {};
    }
  }

  private placeHasPhotos(placeName: string): boolean {
    const albums = this.getPhotoAlbums();
    return (albums[placeName]?.length ?? 0) > 0;
  }

  private getPlacePhotoCount(placeName: string): number {
    const albums = this.getPhotoAlbums();
    return albums[placeName]?.length ?? 0;
  }

  private savePhotoAlbums(albums: Record<string, string[]>): void {
    localStorage.setItem(this.placeAlbumsKey, JSON.stringify(albums));
  }
  private async loadSelectedPlacePhotos(): Promise<void> {
    if (!this.selectedPlace) {
      this.selectedPlacePhotos = [];
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.selectedPlacePhotos = [];
      return;
    }

    try {
      this.selectedPlacePhotos = await this.placePhotoService.getPhotosForPlace(
        userId,
        this.selectedPlace.id
      );

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando fotos:', error);
      this.selectedPlacePhotos = [];
    }
  }

  async onPlacePhotoSelected(event: Event): Promise<void> {
    console.log('ENTRA FOTO');
    if (!this.selectedPlace) return;

    const userId = this.authService.getUserId();
    console.log('USER ID:', userId);

    if (!userId) {
      this.openStatusMessage(
        'Usuario no preparado',
        'Espera unos segundos y vuelve a intentarlo.',
        'info'
      );
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log('FILE:', file);

    if (!file) return;

    try {
      await this.placePhotoService.uploadPlacePhoto(

        userId,
        this.selectedPlace.id,
        this.selectedPlace.name,
        file
      );
      console.log('SUBIENDO...');
      await this.loadSelectedPlacePhotos();
      this.updateMarkers();

      this.openStatusMessage(
        'Foto guardada',
        'La imagen ya forma parte del álbum de este lugar.',
        'success'
      );
    } catch (error) {
      console.error('Error subiendo foto:', error);


      this.openStatusMessage(
        'No se pudo guardar',
        'La foto no se ha podido subir a Firebase.',
        'error'
      );
    }

    input.value = '';
  }
  getSelectedPlacePhotoCount(): number {
    return this.selectedPlacePhotos.length;
  }

  getPlaceStatusLabel(place: any): string {
    const albums = this.getPhotoAlbums();
    const photoCount = albums[place.name]?.length ?? 0;

    if (place.locked) {
      return 'Bloqueado';
    }

    if (photoCount > 0) {
      return 'Visitado';
    }

    return 'Disponible';
  }

  getPlaceStatusClass(place: any): string {
    const albums = this.getPhotoAlbums();
    const photoCount = albums[place.name]?.length ?? 0;

    if (place.locked) {
      return 'status-locked';
    }

    if (photoCount > 0) {
      return 'status-visited';
    }

    return 'status-available';
  }

  async removePlacePhoto(index: number): Promise<void> {
    const userId = this.authService.getUserId();

    if (!userId) return;

    const photo = this.selectedPlacePhotos[index];

    if (!photo) return;

    try {
      await this.placePhotoService.deletePlacePhoto(userId, photo);
      await this.loadSelectedPlacePhotos();
      this.updateMarkers();

      this.openStatusMessage(
        'Foto eliminada',
        'La imagen se ha borrado del álbum de este lugar.',
        'info'
      );
    } catch (error) {


      this.openStatusMessage(
        'No se pudo borrar',
        'La foto no se ha podido eliminar.',
        'error'
      );
    }
  }
  // Dibuja o redibuja todos los marcadores
  private updateMarkers(): void {

    // Eliminamos los marcadores antiguos
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.places.forEach(place => {
      if (
        this.selectedItineraryPlaces.length > 0 &&
        !this.selectedItineraryPlaces.includes(place.id)
      ) {
        return;
      }
      const photoCount = this.getPlacePhotoCount(place.name);
      const hasPhotos = photoCount > 0;

      const cssClass = [
        'custom-marker',
        place.locked ? 'marker-locked' : '',
        hasPhotos && !place.locked ? 'marker-visited' : ''
      ].join(' ').trim();

      const visitedBadge =
        hasPhotos && !place.locked
          ? `
      <div class="marker-visited-badge">
        <span class="marker-check">✓</span>
      </div>
      ${
            photoCount > 1
              ? `<div class="marker-photo-count">${photoCount}</div>`
              : ''
          }
    `
          : '';

      const customIcon = L.divIcon({
        html: `
    <div class="${cssClass}" style="background-image: url('${place.image}')">
      ${visitedBadge}
    </div>
  `,
        className: '',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -30]
      });

      const marker = L.marker(
        [place.location.lat, place.location.lng],
        { icon: customIcon }
      ).addTo(this.map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);

        if (this.isAdminMode) {
          this.zone.run(() => {
            if (place.locked) {
              this.openAdminConfirm(place, 'unlock');
            } else {
              this.openAdminConfirm(place, 'lock');
            }
          });
        } else {
          if (place.locked) {
            marker.bindPopup('🔒 <b>Bloqueado</b><br>Tienes que ir allí.').openPopup();
          } else {
            this.zone.run(() => {
              this.selectedPlace = place;
              this.loadSelectedPlacePhotos();
              this.cdr.detectChanges();
            });
          }
        }
      });

      this.markers.push(marker);
    });
  }

  get totalLockedPlaces(): number {
    return this.places.filter(p => p.locked).length;
  }

  get totalVisitedPlaces(): number {
    const albums = this.getPhotoAlbums();

    return this.places.filter(p => {
      const count = albums[p.name]?.length ?? 0;
      return !p.locked && count > 0;
    }).length;
  }

  get totalAvailablePlaces(): number {
    const albums = this.getPhotoAlbums();

    return this.places.filter(p => {
      const count = albums[p.name]?.length ?? 0;
      return !p.locked && count === 0;
    }).length;
  }
}
