import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

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
export class AvatarSelectorComponent implements OnDestroy {
  avatars: AvatarOption[] = AVATARS;
  selectedAvatarId: string | null = null;

  private avatarSubscription?: Subscription;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {
    this.avatarSubscription = this.profileService.avatar$.subscribe(
      avatarId => {
        this.selectedAvatarId = avatarId;
      }
    );
  }

  selectAvatar(id: string): void {
    this.selectedAvatarId = id;
  }

  async confirmAvatar(): Promise<void> {
    if (!this.selectedAvatarId) return;

    await this.profileService.saveAvatar(
      this.selectedAvatarId
    );

    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.avatarSubscription?.unsubscribe();
  }
}
