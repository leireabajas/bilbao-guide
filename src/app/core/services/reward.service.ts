import { Injectable } from '@angular/core';
import {
  REWARDS,
  RewardItem,
  RewardClaimRequest
} from '../data/rewards.data';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private readonly rewardsKey = 'passportRewards';
  private readonly rewardRequestsKey = 'rewardClaimRequests';

  getRewards(): RewardItem[] {
    const data = localStorage.getItem(this.rewardsKey);

    if (!data) {
      return REWARDS.map(r => ({ ...r }));
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo passportRewards:', error);
      return REWARDS.map(r => ({ ...r }));
    }
  }

  saveRewards(rewards: RewardItem[]): void {
    localStorage.setItem(this.rewardsKey, JSON.stringify(rewards));
  }

  getRewardRequests(): RewardClaimRequest[] {
    const data = localStorage.getItem(this.rewardRequestsKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo rewardClaimRequests:', error);
      return [];
    }
  }

  saveRewardRequests(requests: RewardClaimRequest[]): void {
    localStorage.setItem(this.rewardRequestsKey, JSON.stringify(requests));
  }

  hasPendingRewardRequest(rewardId: string): boolean {
    return this.getRewardRequests().some(
      request => request.rewardId === rewardId && request.status === 'pending'
    );
  }

  createRewardRequest(rewardId: string): RewardClaimRequest | null {
    const rewards = this.getRewards();
    const reward = rewards.find(r => r.id === rewardId);

    if (!reward || reward.status !== 'available') {
      return null;
    }

    const requests = this.getRewardRequests();

    const alreadyRequested = requests.some(
      request => request.rewardId === rewardId && request.status === 'pending'
    );

    if (alreadyRequested) {
      return null;
    }

    const newRequest: RewardClaimRequest = {
      id: `reward-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    this.saveRewardRequests(requests);

    reward.status = 'pending';
    this.saveRewards(rewards);

    return newRequest;
  }

  unlockRandomReward(): RewardItem | null {
    const rewards = this.getRewards();
    const lockedRewards = rewards.filter(r => r.status === 'locked');

    if (lockedRewards.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * lockedRewards.length);
    const selected = lockedRewards[randomIndex];

    const updatedRewards = rewards.map(reward =>
      reward.id === selected.id
        ? { ...reward, status: 'available' as const }
        : reward
    );

    this.saveRewards(updatedRewards);

    return updatedRewards.find(r => r.id === selected.id) ?? null;
  }

  acceptRewardRequest(requestId: string): void {
    const requests = this.getRewardRequests();
    const request = requests.find(r => r.id === requestId);

    if (!request) return;

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    );

    this.saveRewardRequests(updatedRequests);

    const rewards = this.getRewards();
    const updatedRewards = rewards.map(reward =>
      reward.id === request.rewardId
        ? { ...reward, status: 'used' as const }
        : reward
    );

    this.saveRewards(updatedRewards);
  }

  undoAcceptRewardRequest(requestId: string): void {
    const requests = this.getRewardRequests();
    const request = requests.find(r => r.id === requestId);

    if (!request) return;

    const updatedRequests = requests.map(r =>
      r.id === requestId ? { ...r, status: 'pending' as const } : r
    );

    this.saveRewardRequests(updatedRequests);

    const rewards = this.getRewards();
    const updatedRewards = rewards.map(reward =>
      reward.id === request.rewardId
        ? { ...reward, status: 'available' as const }
        : reward
    );

    this.saveRewards(updatedRewards);
  }

  deleteRewardRequest(requestId: string): void {
    const requests = this.getRewardRequests();
    const request = requests.find(r => r.id === requestId);

    if (!request) return;

    const filtered = requests.filter(r => r.id !== requestId);
    this.saveRewardRequests(filtered);

    const rewards = this.getRewards();
    const updatedRewards = rewards.map(reward =>
      reward.id === request.rewardId
        ? { ...reward, status: 'available' as const }
        : reward
    );

    this.saveRewards(updatedRewards);
  }
}
