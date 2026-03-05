import { describe, it, expect } from 'vitest';
import { STEP_NAMES, getProgressPercentage, getStepName, isComplete } from '../ProgressBar';

describe('ProgressBar logic', () => {
  describe('STEP_NAMES', () => {
    it('contient exactement 5 noms d\'étapes', () => {
      expect(STEP_NAMES).toHaveLength(5);
    });

    it('a les bons noms dans l\'ordre', () => {
      expect(STEP_NAMES).toEqual([
        'Problème', 'Contexte', 'Existant', 'Résultat', 'Priorité',
      ]);
    });
  });

  describe('getProgressPercentage', () => {
    it('retourne 20% pour l\'étape 1', () => {
      expect(getProgressPercentage(1, 5)).toBe(20);
    });

    it('retourne 40% pour l\'étape 2', () => {
      expect(getProgressPercentage(2, 5)).toBe(40);
    });

    it('retourne 60% pour l\'étape 3', () => {
      expect(getProgressPercentage(3, 5)).toBe(60);
    });

    it('retourne 80% pour l\'étape 4', () => {
      expect(getProgressPercentage(4, 5)).toBe(80);
    });

    it('retourne 100% pour l\'étape 5', () => {
      expect(getProgressPercentage(5, 5)).toBe(100);
    });

    it('gère un totalSteps custom', () => {
      expect(getProgressPercentage(1, 3)).toBeCloseTo(33.33, 1);
    });

    it('clamp à 100 si currentStep > totalSteps (overflow)', () => {
      expect(getProgressPercentage(6, 5)).toBe(100);
      expect(getProgressPercentage(10, 3)).toBe(100);
    });

    it('clamp à 0 si currentStep < 0 (underflow)', () => {
      expect(getProgressPercentage(-1, 5)).toBe(0);
    });

    it('retourne 0 si totalSteps = 0 (division par zéro)', () => {
      expect(getProgressPercentage(1, 0)).toBe(0);
      expect(getProgressPercentage(0, 0)).toBe(0);
    });

    it('retourne 0 si totalSteps < 0', () => {
      expect(getProgressPercentage(1, -5)).toBe(0);
    });

    it('retourne 0 pour currentStep = 0', () => {
      expect(getProgressPercentage(0, 5)).toBe(0);
    });
  });

  describe('getStepName', () => {
    it('retourne le bon nom pour chaque étape (1 à 5)', () => {
      expect(getStepName(1)).toBe('Problème');
      expect(getStepName(2)).toBe('Contexte');
      expect(getStepName(3)).toBe('Existant');
      expect(getStepName(4)).toBe('Résultat');
      expect(getStepName(5)).toBe('Priorité');
    });

    it('retourne une chaîne vide pour un index hors limites', () => {
      expect(getStepName(0)).toBe('');
      expect(getStepName(6)).toBe('');
    });
  });

  describe('isComplete', () => {
    it('retourne true quand currentStep >= totalSteps', () => {
      expect(isComplete(5, 5)).toBe(true);
      expect(isComplete(6, 5)).toBe(true);
    });

    it('retourne false quand currentStep < totalSteps', () => {
      expect(isComplete(4, 5)).toBe(false);
      expect(isComplete(1, 5)).toBe(false);
    });
  });
});
