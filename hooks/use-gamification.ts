'use client';

import { useState, useCallback, useEffect } from 'react';
import type { UserGamification, Badge, Achievement, UserLevel, Leaderboard } from '@/types/gamification';
import { LEVEL_THRESHOLDS, POINT_ACTIONS, BADGES_LIST } from '@/types/gamification';

const GAMIFICATION_KEY = 'guideLyon_gamification';
const LEADERBOARD_KEY = 'guideLyon_leaderboard';

export function useGamification(userId?: string) {
  const [userProfile, setUserProfile] = useState<UserGamification | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserProfile(userId);
    }
    loadLeaderboard();
  }, [userId]);

  const loadUserProfile = (id: string) => {
    try {
      const stored = localStorage.getItem(GAMIFICATION_KEY);
      const data = stored ? JSON.parse(stored) : {};
      
      if (!data[id]) {
        // Créer un nouveau profil
        data[id] = createNewProfile(id);
        localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
      } else {
        // Vérifier la série quotidienne
        checkDailyStreak(data[id]);
      }
      
      setUserProfile(data[id]);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = () => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      } else {
        // Créer un leaderboard vide
        const newLeaderboard: Leaderboard = {
          period: 'allTime',
          users: [],
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
        setLeaderboard(newLeaderboard);
      }
    } catch (error) {
      console.error('Erreur chargement leaderboard:', error);
    }
  };

  const createNewProfile = (id: string): UserGamification => {
    return {
      userId: id,
      userName: `Utilisateur ${id.slice(-4)}`,
      points: 0,
      level: 'explorer',
      nextLevelPoints: LEVEL_THRESHOLDS.expert,
      badges: [],
      streak: {
        current: 1,
        longest: 1,
        lastActivity: new Date().toISOString(),
      },
      stats: {
        reviews: 0,
        comments: 0,
        favorites: 0,
        shares: 0,
        placesVisited: 0,
        eventsAttended: 0,
        helpfulVotes: 0,
      },
      achievements: [],
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
  };

  const checkDailyStreak = (profile: UserGamification) => {
    const lastActivity = new Date(profile.streak.lastActivity);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Continuer la série
      profile.streak.current++;
      if (profile.streak.current > profile.streak.longest) {
        profile.streak.longest = profile.streak.current;
      }
      // Bonus de série
      if (profile.streak.current === 7) {
        addPoints(profile.userId, 'weekStreak', 50);
      }
    } else if (daysDiff > 1) {
      // Réinitialiser la série
      profile.streak.current = 1;
    }
    
    profile.streak.lastActivity = today.toISOString();
    profile.lastActive = today.toISOString();
  };

  const addPoints = useCallback((userId: string, action: string, points?: number) => {
    try {
      const stored = localStorage.getItem(GAMIFICATION_KEY);
      const data = stored ? JSON.parse(stored) : {};
      
      if (!data[userId]) {
        data[userId] = createNewProfile(userId);
      }
      
      const profile = data[userId] as UserGamification;
      const actionConfig = POINT_ACTIONS[action];
      const pointsToAdd = points || actionConfig?.points || 0;
      
      // Vérifier la limite quotidienne
      if (actionConfig?.dailyLimit) {
        // Implémenter la logique de limite quotidienne si nécessaire
      }
      
      // Ajouter les points
      profile.points += pointsToAdd;
      
      // Mettre à jour les statistiques
      updateStats(profile, action);
      
      // Vérifier le niveau
      updateLevel(profile);
      
      // Vérifier les badges
      checkBadges(profile);
      
      // Sauvegarder
      localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
      
      // Mettre à jour le leaderboard
      updateLeaderboard(profile);
      
      if (userId === userProfile?.userId) {
        setUserProfile(profile);
      }
      
      // Retourner les récompenses obtenues
      return {
        points: pointsToAdd,
        newBadges: [], // À implémenter
        levelUp: false, // À implémenter
      };
    } catch (error) {
      console.error('Erreur ajout points:', error);
      return null;
    }
  }, [userProfile]);

  const updateStats = (profile: UserGamification, action: string) => {
    switch (action) {
      case 'review':
        profile.stats.reviews++;
        break;
      case 'comment':
        profile.stats.comments++;
        break;
      case 'favorite':
        profile.stats.favorites++;
        break;
      case 'share':
        profile.stats.shares++;
        break;
      case 'visit':
        profile.stats.placesVisited++;
        break;
      case 'event':
        profile.stats.eventsAttended++;
        break;
      case 'helpful':
        profile.stats.helpfulVotes++;
        break;
    }
  };

  const updateLevel = (profile: UserGamification) => {
    const oldLevel = profile.level;
    
    if (profile.points >= LEVEL_THRESHOLDS.ambassador) {
      profile.level = 'ambassador';
      profile.nextLevelPoints = 0;
    } else if (profile.points >= LEVEL_THRESHOLDS.expert) {
      profile.level = 'expert';
      profile.nextLevelPoints = LEVEL_THRESHOLDS.ambassador;
    } else {
      profile.level = 'explorer';
      profile.nextLevelPoints = LEVEL_THRESHOLDS.expert;
    }
    
    return oldLevel !== profile.level;
  };

  const checkBadges = (profile: UserGamification) => {
    const newBadges: Badge[] = [];
    
    BADGES_LIST.forEach(badge => {
      // Vérifier si le badge est déjà débloqué
      if (profile.badges.some(b => b.id === badge.id)) {
        return;
      }
      
      let unlocked = false;
      
      switch (badge.condition.type) {
        case 'action_count':
          const stat = badge.condition.action;
          if (stat === 'review' && profile.stats.reviews >= badge.condition.value) {
            unlocked = true;
          } else if (stat === 'helpful' && profile.stats.helpfulVotes >= badge.condition.value) {
            unlocked = true;
          } else if (stat === 'share' && profile.stats.shares >= badge.condition.value) {
            unlocked = true;
          }
          break;
        
        case 'points_threshold':
          if (profile.points >= badge.condition.value) {
            unlocked = true;
          }
          break;
        
        case 'streak':
          if (profile.streak.longest >= badge.condition.value) {
            unlocked = true;
          }
          break;
      }
      
      if (unlocked) {
        const unlockedBadge = { ...badge, unlockedAt: new Date().toISOString() };
        profile.badges.push(unlockedBadge);
        profile.points += badge.points;
        newBadges.push(unlockedBadge);
      }
    });
    
    return newBadges;
  };

  const updateLeaderboard = (profile: UserGamification) => {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      const leaderboard: Leaderboard = stored ? JSON.parse(stored) : {
        period: 'allTime',
        users: [],
        updatedAt: new Date().toISOString(),
      };
      
      // Mettre à jour ou ajouter l'utilisateur
      const existingIndex = leaderboard.users.findIndex(u => u.userId === profile.userId);
      const userEntry = {
        userId: profile.userId,
        userName: profile.userName,
        level: profile.level,
        points: profile.points,
        rank: 0,
        change: 0,
        badges: profile.badges.length,
      };
      
      if (existingIndex >= 0) {
        const oldRank = leaderboard.users[existingIndex].rank;
        leaderboard.users[existingIndex] = userEntry;
        userEntry.change = oldRank - userEntry.rank;
      } else {
        leaderboard.users.push(userEntry);
      }
      
      // Trier et attribuer les rangs
      leaderboard.users.sort((a, b) => b.points - a.points);
      leaderboard.users.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      leaderboard.updatedAt = new Date().toISOString();
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
      setLeaderboard(leaderboard);
    } catch (error) {
      console.error('Erreur mise à jour leaderboard:', error);
    }
  };

  const getUserRank = useCallback((userId: string): number => {
    if (!leaderboard) return 0;
    const user = leaderboard.users.find(u => u.userId === userId);
    return user?.rank || 0;
  }, [leaderboard]);

  const getTopUsers = useCallback((limit: number = 10) => {
    if (!leaderboard) return [];
    return leaderboard.users.slice(0, limit);
  }, [leaderboard]);

  return {
    userProfile,
    leaderboard,
    isLoading,
    addPoints,
    getUserRank,
    getTopUsers,
    checkBadges,
    updateLevel,
  };
}