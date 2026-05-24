import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProfileService } from '../../core/services/profile.service';
import { ChallengeService } from '../../core/services/challenge.service';
import { RewardService } from '../../core/services/reward.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  userName = 'Viajera';

  avatarUrl: string = 'assets/avatars/Harry.png';

  completedChallenges = 0;
  totalChallenges = 0;

  unlockedRewards = 0;
  visitedPlaces = 0;

  welcomeMessage = 'Tu aventura en Bilbao empieza aquí.';

  constructor(
    private profileService: ProfileService,
    private challengeService: ChallengeService,
    private rewardService: RewardService
  ) {}

  ngOnInit(): void {
    this.avatarUrl = this.profileService.getAvatarUrl();
    this.loadStats();
    this.buildWelcomeMessage();
  }

  private loadStats(): void {
    const challenges = this.challengeService.getChallenges();
    this.totalChallenges = challenges.length;
    this.completedChallenges = challenges.filter(c => c.status === 'completed').length;

    const rewards = this.rewardService.getRewards();
    this.unlockedRewards = rewards.filter(
      r => r.status === 'available' || r.status === 'pending' || r.status === 'used'
    ).length;

    const unlockedPlacesRaw = localStorage.getItem('unlockedPlaces');

    if (!unlockedPlacesRaw) {
      this.visitedPlaces = 0;
      return;
    }

    try {
      const unlockedPlaces = JSON.parse(unlockedPlacesRaw);
      this.visitedPlaces = unlockedPlaces.length;
    } catch (error) {
      console.error('Error leyendo unlockedPlaces:', error);
      this.visitedPlaces = 0;
    }
  }

  private buildWelcomeMessage(): void {
    const totalProgress = this.completedChallenges + this.visitedPlaces;

    if (totalProgress === 0) {
      this.welcomeMessage = 'Tu aventura en Bilbao empieza aquí.';
      return;
    }

    if (totalProgress < 5) {
      this.welcomeMessage = 'Ya has empezado a dejar huella en el viaje.';
      return;
    }

    if (totalProgress < 12) {
      this.welcomeMessage = 'El viaje ya tiene recuerdos, retos y lugares desbloqueados.';
      return;
    }

    this.welcomeMessage = 'Tu pasaporte ya empieza a parecerse a una historia completa.';
  }

  get progressPercentage(): number {
    if (this.totalChallenges === 0) {
      return 0;
    }

    return Math.round((this.completedChallenges / this.totalChallenges) * 100);
  }
}
