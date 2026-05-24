import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

export interface PlacePhoto {
  id?: string;
  placeId: string;
  placeName: string;
  url: string;
  path: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlacePhotoService {

  constructor(
    private storage: Storage,
    private firestore: Firestore
  ) {}

  async uploadPlacePhoto(
    userId: string,
    placeId: string,
    placeName: string,
    file: File
  ): Promise<void> {
    const photoId = `photo-${Date.now()}`;
    const path = `users/${userId}/places/${placeId}/${photoId}-${file.name}`;

    const storageRef = ref(this.storage, path);

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    const photosCollection = collection(
      this.firestore,
      `users/${userId}/placePhotos`
    );

    await addDoc(photosCollection, {
      placeId,
      placeName,
      url,
      path,
      createdAt: Date.now()
    });
  }

  async getPhotosForPlace(
    userId: string,
    placeId: string
  ): Promise<PlacePhoto[]> {
    const photosCollection = collection(
      this.firestore,
      `users/${userId}/placePhotos`
    );

    const q = query(
      photosCollection,
      where('placeId', '==', placeId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(document => ({
      id: document.id,
      ...(document.data() as Omit<PlacePhoto, 'id'>)
    }));
  }

  async deletePlacePhoto(
    userId: string,
    photo: PlacePhoto
  ): Promise<void> {
    if (!photo.id) return;

    const storageRef = ref(this.storage, photo.path);
    await deleteObject(storageRef);

    const photoDoc = doc(
      this.firestore,
      `users/${userId}/placePhotos/${photo.id}`
    );

    await deleteDoc(photoDoc);
  }
}
