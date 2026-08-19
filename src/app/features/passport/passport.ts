import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHALLENGES } from '../../core/data/challenges.data';
import { ProfileService } from '../../core/services/profile.service';
import { RewardService } from '../../core/services/reward.service';

import {
  ChallengeService,
  ChallengeItem,
  ChallengeStatus,
  PendingRequest
} from '../../core/services/challenge.service';

import {
  REWARDS,
  RewardItem,
  RewardStatus,
  RewardClaimRequest
} from '../../core/data/rewards.data';


interface EuskeraQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passport.html',
  styleUrls: ['./passport.scss']
})
export class PassportComponent implements OnInit {
  selectedAvatar: string | null = null;

  // ===== LUGARES =====
  visitedPlaces = 0;
  totalPlaces = 8;
  visitedPlacesList: string[] = [];

  // Sección desplegable abierta actualmente
  // Valores posibles:
  // 'places' | 'mandatory' | 'optional' | 'quiz' | 'euskera' | 'rewards' | null
  openSection: 'places' | 'mandatory' | 'optional' | 'quiz' | 'euskera' | 'rewards' | null = null;

  // Retos base del pasaporte
  challenges: ChallengeItem[] = CHALLENGES.map(challenge => ({ ...challenge }));

// Recompensas base
  rewards: RewardItem[] = REWARDS.map(r => ({ ...r }));

  // ===== QUIZ BILBAO =====
  showBilbaoQuiz = false;
  selectedBilbaoChallenge: ChallengeItem | null = null;
  selectedBilbaoAnswerIndex: number | null = null;
  showBilbaoFeedback = false;
  bilbaoQuizCompleted = false;


  selectedEuskeraChallenge: ChallengeItem | null = null;

  // ===== QUIZ DE EUSKERA =====
  showEuskeraQuiz = false;

  private readonly euskeraProgressKey = 'euskeraQuizProgress';
  completedEuskeraHistory: ChallengeItem[] = [];
  private readonly euskeraHistoryKey = 'euskeraHistory';
  private readonly rewardedEuskeraLevelsKey = 'rewardedEuskeraLevels';
  private readonly rewardedBilbaoLevelsKey = 'rewardedBilbaoLevels';

  // ===== GUARDADO RECOMPENSAS =====

  // Cierra el mensaje al usar recompensa
  closeRewardMessage(): void {
    this.showRewardMessage = false;
    this.rewardMessageTitle = '';
    this.rewardMessageText = '';
  }





  currentEuskeraQuestionIndex = 0;
  selectedEuskeraAnswer: string | null = null;
  showEuskeraFeedback = false;
  euskeraQuizCompleted = false;
  // Mensaje bonito al usar una recompensa
  showRewardMessage = false;
  rewardMessageTitle = '';
  rewardMessageText = '';
  showCompletedEuskera = false;



  constructor(
    private profileService: ProfileService,
    private challengeService: ChallengeService,
    private rewardService: RewardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedAvatar = this.profileService.getAvatarUrl();

    this.loadVisitedPlaces();

    this.rewards = this.rewardService.getRewards();

    void this.loadInitialChallenges();
    void this.loadPendingChallengeRequests();
  }

  private async loadInitialChallenges(): Promise<void> {
    const storedChallenges = await this.challengeService.getChallenges();

    if (storedChallenges.length > 0) {
      this.challenges = storedChallenges;
    } else {
      this.challenges = CHALLENGES.map(challenge => ({ ...challenge }));
      await this.saveChallenges();
    }

    this.loadCompletedEuskeraHistory();
    this.pickCurrentEuskeraChallenge();
    this.loadEuskeraProgress();

    this.cdr.detectChanges();
  }
// ===== SOLICITUDES DE RECOMPENSA =====
  private saveEuskeraHistory(challenge: ChallengeItem): void {
    const current = this.getEuskeraHistoryIds();

    if (current.includes(challenge.id)) {
      return;
    }

    current.push(challenge.id);
    localStorage.setItem(this.euskeraHistoryKey, JSON.stringify(current));
  }

  private getEuskeraHistoryIds(): string[] {
    const data = localStorage.getItem(this.euskeraHistoryKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo euskeraHistory:', error);
      return [];
    }
  }

  private loadCompletedEuskeraHistory(): void {
    this.completedEuskeraHistory = this.challenges.filter(
      c => c.status === 'completed'
    );
  }

  private saveEuskeraProgress(): void {
    if (!this.selectedEuskeraChallenge) {
      localStorage.removeItem(this.euskeraProgressKey);
      return;
    }

    const progress = {
      challengeId: this.selectedEuskeraChallenge.id,
      questionIndex: this.currentEuskeraQuestionIndex
    };

    localStorage.setItem(this.euskeraProgressKey, JSON.stringify(progress));
  }

  private clearEuskeraProgress(): void {
    localStorage.removeItem(this.euskeraProgressKey);
  }

  private loadEuskeraProgress(): void {
    const data = localStorage.getItem(this.euskeraProgressKey);

    if (!data) {
      return;
    }

    try {
      const progress = JSON.parse(data);

      const challenge = this.euskeraChallenges.find(
        c => c.id === progress.challengeId && c.status !== 'completed'
      );

      if (!challenge) {
        this.clearEuskeraProgress();
        return;
      }

      this.selectedEuskeraChallenge = challenge;
      this.currentEuskeraQuestionIndex = progress.questionIndex ?? 0;
    } catch (error) {
      console.error('Error leyendo progreso de euskera:', error);
      this.clearEuskeraProgress();
    }
  }
  private getRewardedLevels(storageKey: string): number[] {
    const data = localStorage.getItem(storageKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error leyendo ${storageKey}:`, error);
      return [];
    }
  }

  private saveRewardedLevels(storageKey: string, levels: number[]): void {
    localStorage.setItem(storageKey, JSON.stringify(levels));
  }

  private hasLevelRewardBeenGranted(
    storageKey: string,
    level: 1 | 2 | 3
  ): boolean {
    const rewardedLevels = this.getRewardedLevels(storageKey);
    return rewardedLevels.includes(level);
  }

  private markLevelRewardAsGranted(
    storageKey: string,
    level: 1 | 2 | 3
  ): void {
    const rewardedLevels = this.getRewardedLevels(storageKey);

    if (rewardedLevels.includes(level)) {
      return;
    }

    rewardedLevels.push(level);
    this.saveRewardedLevels(storageKey, rewardedLevels);
  }
  private unlockRewardForCompletedLevel(
    mode: 'euskera' | 'bilbao',
    level: 1 | 2 | 3
  ): void {
    const storageKey =
      mode === 'euskera'
        ? this.rewardedEuskeraLevelsKey
        : this.rewardedBilbaoLevelsKey;

    if (this.hasLevelRewardBeenGranted(storageKey, level)) {
      return;
    }

    const unlockedReward = this.rewardService.unlockRandomReward();
    this.rewards = this.rewardService.getRewards();

    if (!unlockedReward) {
      return;
    }

    this.markLevelRewardAsGranted(storageKey, level);

    this.rewardMessageTitle = 'Recompensa desbloqueada';
    this.rewardMessageText = `"${unlockedReward.title}" ya está disponible para cuando quieras reclamarla.`;
    this.showRewardMessage = true;
  }

  private isEuskeraLevelCompleted(level: 1 | 2 | 3): boolean {
    if (level === 1) {
      return (
        this.euskeraLevel1Challenges.length > 0 &&
        this.completedEuskeraLevel1 === this.euskeraLevel1Challenges.length
      );
    }

    if (level === 2) {
      return (
        this.euskeraLevel2Challenges.length > 0 &&
        this.completedEuskeraLevel2 === this.euskeraLevel2Challenges.length
      );
    }

    return (
      this.euskeraLevel3Challenges.length > 0 &&
      this.completedEuskeraLevel3 === this.euskeraLevel3Challenges.length
    );
  }

  private isBilbaoLevelCompleted(level: 1 | 2 | 3): boolean {
    if (level === 1) {
      return (
        this.bilbaoLevel1Challenges.length > 0 &&
        this.completedBilbaoLevel1 === this.bilbaoLevel1Challenges.length
      );
    }

    if (level === 2) {
      return (
        this.bilbaoLevel2Challenges.length > 0 &&
        this.completedBilbaoLevel2 === this.bilbaoLevel2Challenges.length
      );
    }

    return (
      this.bilbaoLevel3Challenges.length > 0 &&
      this.completedBilbaoLevel3 === this.bilbaoLevel3Challenges.length
    );
  }

  private checkEuskeraLevelReward(level: 1 | 2 | 3): void {
    if (this.isEuskeraLevelCompleted(level)) {
      this.unlockRewardForCompletedLevel('euskera', level);
    }
  }

  private checkBilbaoLevelReward(level: 1 | 2 | 3): void {
    if (this.isBilbaoLevelCompleted(level)) {
      this.unlockRewardForCompletedLevel('bilbao', level);
    }
  }


// Comprueba si una recompensa ya tiene una solicitud pendiente
  hasPendingRewardRequest(rewardId: string): boolean {
    return this.rewardService.hasPendingRewardRequest(rewardId);
  }
  toggleCompletedEuskera(): void {
    this.showCompletedEuskera = !this.showCompletedEuskera;
  }

  async resetEuskeraChallenge(
    challenge: ChallengeItem
  ): Promise<void> {

    await this.challengeService.resetChallenge(challenge.id);

    await this.loadChallenges();

    localStorage.removeItem('currentEuskeraChallengeId');

    this.pickCurrentEuskeraChallenge();
  }

// Solicita reclamar una recompensa
  requestRewardClaim(rewardId: string): void {
    const reward = this.rewards.find(r => r.id === rewardId);

    if (!reward || reward.status !== 'available') {
      return;
    }

    const created = this.rewardService.createRewardRequest(rewardId);

    if (!created) {
      return;
    }

    this.rewards = this.rewardService.getRewards();

    this.rewardMessageTitle = 'Solicitud enviada';
    this.rewardMessageText = `"${reward.title}" ha quedado pendiente de validación.`;
    this.showRewardMessage = true;
  }



  // ===== GETTERS DE RETOS =====
  get euskeraQuestions(): EuskeraQuestion[] {
    return this.selectedEuskeraChallenge?.euskeraQuiz ?? [];
  }
  get mandatoryChallenges(): ChallengeItem[] {
    return this.challenges.filter(challenge => challenge.type === 'mandatory');
  }

  get optionalChallenges(): ChallengeItem[] {
    return this.challenges.filter(challenge => challenge.type === 'optional');
  }

  get euskeraChallenges(): ChallengeItem[] {
    return this.challenges.filter(challenge => challenge.type === 'euskera');
  }
  get euskeraLevel1Challenges(): ChallengeItem[] {
    return this.euskeraChallenges.filter(challenge => challenge.level === 1);
  }

  get euskeraLevel2Challenges(): ChallengeItem[] {
    return this.euskeraChallenges.filter(challenge => challenge.level === 2);
  }

  get euskeraLevel3Challenges(): ChallengeItem[] {
    return this.euskeraChallenges.filter(challenge => challenge.level === 3);
  }

  get completedEuskeraLevel1(): number {
    return this.euskeraLevel1Challenges.filter(c => c.status === 'completed').length;
  }

  get completedEuskeraLevel2(): number {
    return this.euskeraLevel2Challenges.filter(c => c.status === 'completed').length;
  }

  get completedEuskeraLevel3(): number {
    return this.euskeraLevel3Challenges.filter(c => c.status === 'completed').length;
  }

  get euskeraLevel1Progress(): number {
    if (this.euskeraLevel1Challenges.length === 0) return 0;
    return Math.round((this.completedEuskeraLevel1 / this.euskeraLevel1Challenges.length) * 100);
  }

  get euskeraLevel2Progress(): number {
    if (this.euskeraLevel2Challenges.length === 0) return 0;
    return Math.round((this.completedEuskeraLevel2 / this.euskeraLevel2Challenges.length) * 100);
  }

  get euskeraLevel3Progress(): number {
    if (this.euskeraLevel3Challenges.length === 0) return 0;
    return Math.round((this.completedEuskeraLevel3 / this.euskeraLevel3Challenges.length) * 100);
  }
  get isLevel1Unlocked(): boolean {
    return true;
  }

  get isLevel2Unlocked(): boolean {
    return (
      this.euskeraLevel1Challenges.length > 0 &&
      this.completedEuskeraLevel1 === this.euskeraLevel1Challenges.length
    );
  }

  get isLevel3Unlocked(): boolean {
    return (
      this.euskeraLevel2Challenges.length > 0 &&
      this.completedEuskeraLevel2 === this.euskeraLevel2Challenges.length
    );
  }

  get unlockedEuskeraChallenges(): ChallengeItem[] {
    return this.euskeraChallenges.filter(challenge => {
      if (challenge.level === 1) {
        return this.isLevel1Unlocked;
      }

      if (challenge.level === 2) {
        return this.isLevel2Unlocked;
      }

      if (challenge.level === 3) {
        return this.isLevel3Unlocked;
      }

      return true;
    });
  }
  get bilbaoLevel1Challenges(): ChallengeItem[] {
    return this.quizChallenges.filter(challenge => challenge.level === 1);
  }

  get bilbaoLevel2Challenges(): ChallengeItem[] {
    return this.quizChallenges.filter(challenge => challenge.level === 2);
  }

  get bilbaoLevel3Challenges(): ChallengeItem[] {
    return this.quizChallenges.filter(challenge => challenge.level === 3);
  }

  get completedBilbaoLevel1(): number {
    return this.bilbaoLevel1Challenges.filter(c => c.status === 'completed').length;
  }

  get completedBilbaoLevel2(): number {
    return this.bilbaoLevel2Challenges.filter(c => c.status === 'completed').length;
  }

  get completedBilbaoLevel3(): number {
    return this.bilbaoLevel3Challenges.filter(c => c.status === 'completed').length;
  }

  get isBilbaoLevel1Unlocked(): boolean {
    return true;
  }

  get isBilbaoLevel2Unlocked(): boolean {
    return (
      this.bilbaoLevel1Challenges.length > 0 &&
      this.completedBilbaoLevel1 === this.bilbaoLevel1Challenges.length
    );
  }

  get isBilbaoLevel3Unlocked(): boolean {
    return (
      this.bilbaoLevel2Challenges.length > 0 &&
      this.completedBilbaoLevel2 === this.bilbaoLevel2Challenges.length
    );
  }


  openBilbaoLevel(level: 1 | 2 | 3): void {
    if (level === 2 && !this.isBilbaoLevel2Unlocked) {
      return;
    }

    if (level === 3 && !this.isBilbaoLevel3Unlocked) {
      return;
    }

    const availableChallenge = this.quizChallenges.find(
      challenge =>
        challenge.level === level &&
        challenge.status !== 'completed'
    );

    if (availableChallenge) {
      this.openBilbaoQuiz(availableChallenge);
      return;
    }

    const fallbackChallenge = this.quizChallenges.find(
      challenge => challenge.level === level
    );

    if (fallbackChallenge) {
      this.openBilbaoQuiz(fallbackChallenge);
    }
  }

  get quizChallenges(): ChallengeItem[] {
    return this.challenges.filter(challenge => challenge.type === 'quiz');
  }
  // ===== GETTERS DE RESUMEN =====

  get completedChallenges(): number {
    return this.challenges.filter(
      challenge => challenge.status === 'completed'
    ).length;
  }

  get totalChallenges(): number {
    return this.challenges.length;
  }

  get rewardsUnlocked(): number {
    return this.rewards.filter(
      reward =>
        reward.status === 'available' ||
        reward.status === 'pending' ||
        reward.status === 'used'
    ).length;
  }

  get completedRecords(): number {
    return this.visitedPlaces + this.completedChallenges;
  }

  get summaryMessage(): string {
    if (this.visitedPlaces === 0 && this.completedChallenges === 0) {
      return 'El recorrido aún no ha comenzado.';
    }

    if (this.completedRecords < 4) {
      return 'El recorrido empieza a tomar forma.';
    }

    if (this.completedRecords < this.totalPlaces + this.totalChallenges) {
      return 'El viaje avanza y deja huella.';
    }

    return 'Todo el recorrido ha quedado registrado.';
  }

  get progressPercentage(): number {
    return Math.round(
      (this.completedRecords / (this.totalPlaces + this.totalChallenges)) * 100
    );
  }

  // ===== GETTERS QUIZ EUSKERA =====

  get currentEuskeraQuestion(): EuskeraQuestion | null {
    return this.euskeraQuestions[this.currentEuskeraQuestionIndex] ?? null;
  }

  get euskeraProgressPercentage(): number {
    return ((this.currentEuskeraQuestionIndex + 1) / this.euskeraQuestions.length) * 100;
  }

  get isEuskeraAnswerCorrect(): boolean {
    if (!this.currentEuskeraQuestion || this.selectedEuskeraAnswer === null) {
      return false;
    }

    const correctOption =
      this.currentEuskeraQuestion.options[this.currentEuskeraQuestion.correctIndex];

    return this.selectedEuskeraAnswer === correctOption;
  }

  get currentBilbaoQuiz() {
    return this.selectedBilbaoChallenge?.quiz;
  }

  get isBilbaoAnswerCorrect(): boolean {
    if (!this.currentBilbaoQuiz || this.selectedBilbaoAnswerIndex === null) {
      return false;
    }

    return this.selectedBilbaoAnswerIndex === this.currentBilbaoQuiz.correctIndex;
  }

  // ===== TEXTOS =====

  getStatusLabel(status: ChallengeStatus): string {
    if (status === 'completed') return 'Registrado';
    if (status === 'available') return 'Disponible';
    return 'Pendiente';
  }

  getRewardStatusLabel(status: RewardStatus): string {
    if (status === 'available') return 'Disponible';
    if (status === 'pending') return 'Pendiente';
    if (status === 'used') return 'Reclamada';
    return 'Bloqueado';
  }
  pendingChallengeRequests: PendingRequest[] = [];

  private async loadPendingChallengeRequests(): Promise<void> {
    this.pendingChallengeRequests =
      await this.challengeService.getPendingRequests();

    console.log(
      'SOLICITUDES CARGADAS:',
      this.pendingChallengeRequests
    );
  }
  // ===== SOLICITUDES =====
  currentEuskeraChallenge: ChallengeItem | null = null;

  private pickCurrentEuskeraChallenge(): void {
    const available = this.unlockedEuskeraChallenges.filter(
      c => c.status !== 'completed'
    );

    if (available.length === 0) {
      this.currentEuskeraChallenge = null;
      return;
    }

    this.currentEuskeraChallenge = available[0];
  }

  async requestChallengeApproval(
    challenge: ChallengeItem
  ): Promise<void> {

    console.log('BOTÓN SOLICITAR PULSADO');

    await this.challengeService.createPendingRequest(challenge);

    await this.loadPendingChallengeRequests();
  }

  hasPendingRequest(challengeId: string): boolean {
    return this.pendingChallengeRequests.some(
      request =>
        request.challengeId === challengeId &&
        request.status === 'pending'
    );
  }

  // ===== GUARDADO RETOS =====

  private async saveChallenges(): Promise<void> {
    await this.challengeService.saveChallenges(this.challenges);
  }

  private async loadChallenges(): Promise<void> {
    const storedChallenges = await this.challengeService.getChallenges();

    if (storedChallenges.length > 0) {
      this.challenges = storedChallenges;
    }

    this.cdr.detectChanges();
  }


  // ===== LUGARES =====

  private loadVisitedPlaces(): void {
    const data = localStorage.getItem('unlockedPlaces');

    if (!data) {
      this.visitedPlaces = 0;
      this.visitedPlacesList = [];
      return;
    }

    try {
      const unlocked = JSON.parse(data);
      this.visitedPlaces = unlocked.length;
      this.visitedPlacesList = unlocked;
    } catch (error) {
      console.error('Error leyendo unlockedPlaces:', error);
      this.visitedPlaces = 0;
      this.visitedPlacesList = [];
    }
  }

  getPlaceLabel(placeId: string): string {
    const placeLabels: Record<string, string> = {
      'Museo Guggenheim': 'Museo Guggenheim',
      'San Mamés': 'San Mamés',
      'Casco Viejo': 'Casco Viejo',
      'Puente Zubizuri': 'Puente Zubizuri',
      guggenheim: 'Museo Guggenheim',
      zubizuri: 'Zubizuri',
      cascoViejo: 'Casco Viejo',
      cascoviejo: 'Casco Viejo',
      mercadoRibera: 'Mercado de la Ribera',
      mercadoribera: 'Mercado de la Ribera',
      sanMames: 'San Mamés',
      sanmames: 'San Mamés',
      donaCasilda: 'Parque de Doña Casilda',
      donacasilda: 'Parque de Doña Casilda'
    };

    return placeLabels[placeId] || placeId;
  }

  // Abre una sección y cierra la que estuviera abierta
  toggleSection(
    section: 'places' | 'mandatory' | 'optional' | 'quiz' | 'euskera' | 'rewards'
  ): void {
    this.openSection = this.openSection === section ? null : section;
  }

  isSectionOpen(
    section: 'places' | 'mandatory' | 'optional' | 'quiz' | 'euskera' | 'rewards'
  ): boolean {
    return this.openSection === section;
  }

  // ===== QUIZ EUSKERA =====

  openEuskeraQuiz(challenge: ChallengeItem): void {
    const hasSavedProgress =
      this.selectedEuskeraChallenge?.id === challenge.id &&
      this.currentEuskeraQuestionIndex > 0 &&
      !this.euskeraQuizCompleted;

    this.selectedEuskeraChallenge = challenge;
    this.showEuskeraQuiz = true;

    if (!hasSavedProgress) {
      this.currentEuskeraQuestionIndex = 0;
      this.selectedEuskeraAnswer = null;
      this.showEuskeraFeedback = false;
      this.euskeraQuizCompleted = false;
      this.saveEuskeraProgress();
      this.saveEuskeraHistory(challenge);
      this.loadCompletedEuskeraHistory();
    }
  }

  closeEuskeraQuiz(): void {
    this.showEuskeraQuiz = false;
    this.selectedEuskeraChallenge = null;
    this.showEuskeraFeedback = false;
  }

  selectEuskeraAnswer(option: string): void {
    if (!this.currentEuskeraQuestion) {
      return;
    }

    if (this.showEuskeraFeedback && this.isEuskeraAnswerCorrect) {
      return;
    }

    this.selectedEuskeraAnswer = option;
    this.showEuskeraFeedback = true;

  }

  get visibleRewards(): RewardItem[] {
    return this.rewards.filter(r => r.status !== 'locked');
  }

  async goToNextEuskeraStep(): Promise<void> {
    if (!this.showEuskeraFeedback || !this.selectedEuskeraChallenge) {
      return;
    }

    const challenge = this.selectedEuskeraChallenge;

    const isLastQuestion =
      this.currentEuskeraQuestionIndex === this.euskeraQuestions.length - 1;

    if (isLastQuestion) {
      this.euskeraQuizCompleted = true;
      this.clearEuskeraProgress();

      await this.challengeService.updateChallengeStatus(
        challenge.id,
        'completed'
      );

      await this.loadChallenges();

      this.loadCompletedEuskeraHistory();

      if (challenge.level) {
        this.checkEuskeraLevelReward(challenge.level);
      }

      this.pickCurrentEuskeraChallenge();

      return;
    }

    this.currentEuskeraQuestionIndex++;
    this.selectedEuskeraAnswer = null;
    this.showEuskeraFeedback = false;
    this.saveEuskeraProgress();
  }

  // ===== QUIZ BILBAO =====

  openBilbaoQuiz(challenge: ChallengeItem): void {
    this.selectedBilbaoChallenge = challenge;
    this.showBilbaoQuiz = true;
    this.selectedBilbaoAnswerIndex = null;
    this.showBilbaoFeedback = false;
    this.bilbaoQuizCompleted = false;
  }

  closeBilbaoQuiz(): void {
    this.showBilbaoQuiz = false;
    this.selectedBilbaoChallenge = null;
    this.selectedBilbaoAnswerIndex = null;
    this.showBilbaoFeedback = false;
    this.bilbaoQuizCompleted = false;
  }

  selectBilbaoAnswer(index: number): void {
    if (this.showBilbaoFeedback) {
      return;
    }

    this.selectedBilbaoAnswerIndex = index;
    this.showBilbaoFeedback = true;
  }

  async completeBilbaoQuiz(): Promise<void> {
    if (!this.selectedBilbaoChallenge) {
      return;
    }

    this.bilbaoQuizCompleted = true;

    const challenge = this.selectedBilbaoChallenge;

    await this.challengeService.updateChallengeStatus(
      challenge.id,
      'completed'
    );

    await this.loadChallenges();

    if (challenge.level) {
      this.checkBilbaoLevelReward(challenge.level);
    }
  }

  // ===== RECOMPENSAS RANDOM =====

  openEuskeraLevel(level: 1 | 2 | 3): void {
    if (level === 2 && !this.isLevel2Unlocked) {
      return;
    }

    if (level === 3 && !this.isLevel3Unlocked) {
      return;
    }

    const availableChallenge = this.euskeraChallenges.find(
      challenge =>
        challenge.level === level &&
        challenge.status !== 'completed'
    );

    if (!availableChallenge) {
      return;
    }

    this.currentEuskeraChallenge = availableChallenge;
    this.openEuskeraQuiz(availableChallenge);
  }

  getTypeLabel(type: ChallengeItem['type']): string {
    if (type === 'mandatory') return 'Reto del recorrido';
    if (type === 'optional') return 'Reto opcional';
    if (type === 'quiz') return 'Curiosidad de Bilbao';
    return 'Euskera';
  }

}



