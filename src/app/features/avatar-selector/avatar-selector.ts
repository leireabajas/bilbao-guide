import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AVATARS } from '../../core/data/avatars.data';
import { AvatarOption } from '../../core/models/avatar.model';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-avatar-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './avatar-selector.html',
  styleUrl: './avatar-selector.scss'
})
export class AvatarSelectorComponent {
  avatars: AvatarOption[] = AVATARS;
  selectedAvatarId: string | null = null;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  selectAvatar(id: string): void {
    this.selectedAvatarId = id;
  }

  confirmAvatar(): void {
    if (!this.selectedAvatarId) return;

    this.profileService.saveAvatar(this.selectedAvatarId);
    this.router.navigate(['/home']);
  }
}
