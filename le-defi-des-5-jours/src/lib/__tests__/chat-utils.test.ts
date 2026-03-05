import { describe, it, expect } from 'vitest';
import { extractStep, extractBrief, cleanContent } from '../chat-utils';
import type { BriefData } from '@/types';

const VALID_BRIEF: BriefData = {
  company: 'Acme Corp',
  contact: 'Alice Dupont',
  sector: 'fintech',
  problem: 'Processus trop lents',
  users: '50 employés',
  current_solution: 'Excel manuel',
  desired_outcome: 'Automatisation complète',
  five_day_scope: 'MVP dashboard',
  suggested_deliverable: 'Application web',
  notes: '',
};

describe('extractStep', () => {
  it('extrait le numéro d\'étape et nettoie le contenu', () => {
    const result = extractStep('[STEP:2] Quelle est la solution actuelle ?');
    expect(result.step).toBe(2);
    expect(result.cleanContent).not.toContain('[STEP:2]');
    expect(result.cleanContent).toContain('Quelle est la solution actuelle ?');
  });

  it('retourne null si pas de tag', () => {
    const result = extractStep('Message sans tag');
    expect(result.step).toBeNull();
    expect(result.cleanContent).toBe('Message sans tag');
  });

  it('gère le tag en fin de message', () => {
    const result = extractStep('Bonjour, pouvez-vous préciser ? [STEP:3]');
    expect(result.step).toBe(3);
    expect(result.cleanContent).not.toContain('[STEP:3]');
  });

  // [M3] Fix: assert que c'est bien le DERNIER tag (2, pas 1)
  it('extrait le dernier tag si plusieurs présents', () => {
    const result = extractStep('[STEP:1] Texte [STEP:2] Suite');
    expect(result.step).toBe(2);
    expect(result.cleanContent).not.toContain('[STEP:');
  });

  it('gère les étapes 1 à 5', () => {
    for (let n = 1; n <= 5; n++) {
      const result = extractStep(`[STEP:${n}] Contenu`);
      expect(result.step).toBe(n);
    }
  });
});

describe('extractBrief', () => {
  it('parse un JSON valide dans un bloc ```json```', () => {
    const content = `Parfait, j'ai tout ce qu'il me faut...\n\`\`\`json\n${JSON.stringify(VALID_BRIEF)}\n\`\`\``;
    const result = extractBrief(content);
    expect(result).toEqual(VALID_BRIEF);
  });

  it('retourne null si pas de bloc JSON', () => {
    expect(extractBrief('Message sans JSON')).toBeNull();
  });

  it('retourne null si JSON malformé', () => {
    expect(extractBrief('```json\nnot valid json\n```')).toBeNull();
  });

  it('retourne null pour un bloc json vide', () => {
    expect(extractBrief('```json\n\n```')).toBeNull();
  });

  it('ignore les blocs non-json', () => {
    expect(extractBrief('```typescript\nconst x = 1;\n```')).toBeNull();
  });

  // [H2] Validation structurelle runtime
  it('retourne null si des champs obligatoires sont manquants', () => {
    const incomplete = { company: 'Acme', contact: 'Alice' }; // champs manquants
    const content = `\`\`\`json\n${JSON.stringify(incomplete)}\n\`\`\``;
    expect(extractBrief(content)).toBeNull();
  });

  it('retourne null si le JSON est un tableau (pas un objet)', () => {
    const content = '```json\n[1, 2, 3]\n```';
    expect(extractBrief(content)).toBeNull();
  });

  it('accepte un brief avec notes vide', () => {
    const briefNotesVide = { ...VALID_BRIEF, notes: '' };
    const content = `\`\`\`json\n${JSON.stringify(briefNotesVide)}\n\`\`\``;
    expect(extractBrief(content)).toEqual(briefNotesVide);
  });
});

describe('cleanContent', () => {
  it('supprime le tag [STEP:N]', () => {
    const clean = cleanContent('[STEP:2] Quel est votre problème ?');
    expect(clean).not.toContain('[STEP:2]');
    expect(clean).toContain('Quel est votre problème ?');
  });

  it('supprime le bloc ```json``` complet', () => {
    const content = `Parfait !\n\`\`\`json\n${JSON.stringify(VALID_BRIEF)}\n\`\`\``;
    const clean = cleanContent(content);
    expect(clean).not.toContain('```json');
    expect(clean).toContain('Parfait !');
  });

  it('supprime à la fois le tag et le bloc JSON', () => {
    const content = `[STEP:5] Parfait, j'ai tout.\n\`\`\`json\n${JSON.stringify(VALID_BRIEF)}\n\`\`\``;
    const clean = cleanContent(content);
    expect(clean).not.toContain('[STEP:5]');
    expect(clean).not.toContain('```json');
    expect(clean).toContain("Parfait, j'ai tout.");
  });

  it('retourne le contenu intact si rien à supprimer', () => {
    expect(cleanContent('Message normal')).toBe('Message normal');
  });

  // [H1] Bloc JSON incomplet pendant le streaming
  it('supprime un bloc JSON incomplet (streaming en cours)', () => {
    const partial = "[STEP:5] Parfait, j'ai tout.\n```json\n{\"company\": \"Acme\""; // pas de closing ```
    const clean = cleanContent(partial);
    expect(clean).not.toContain('[STEP:5]');
    expect(clean).not.toContain('```json');
    expect(clean).toContain("Parfait, j'ai tout.");
  });

  it('supprime le bloc JSON même si juste ```json seul', () => {
    const content = "Parfait !\n```json";
    const clean = cleanContent(content);
    expect(clean).not.toContain('```json');
    expect(clean).toContain('Parfait !');
  });
});
