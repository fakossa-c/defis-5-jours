import { describe, it, expect } from 'vitest';
import { generateSystemPrompt } from '../system-prompt';

describe('generateSystemPrompt', () => {
  it('génère un prompt de base sans contexte', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('consultant IA');
    expect(prompt).toContain('Défi des 5 Jours');
    expect(prompt).toContain('français');
    expect(prompt).not.toContain("L'entreprise");
    expect(prompt).not.toContain('Le rôle');
    expect(prompt).not.toContain("Le secteur");
  });

  it('inclut le nom de l\'entreprise quand fourni', () => {
    const prompt = generateSystemPrompt({ company: 'Acme Corp', role: '', sector: '' });
    expect(prompt).toContain('Acme Corp');
    expect(prompt).toContain("L'entreprise du prospect");
  });

  it('inclut le rôle quand fourni', () => {
    const prompt = generateSystemPrompt({ company: '', role: 'CTO', sector: '' });
    expect(prompt).toContain('CTO');
    expect(prompt).toContain('Le rôle du prospect');
  });

  it('inclut le secteur quand fourni', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: 'fintech' });
    expect(prompt).toContain('fintech');
    expect(prompt).toContain("Le secteur d'activité");
  });

  it('inclut tout le contexte quand complet', () => {
    const prompt = generateSystemPrompt({
      company: 'Acme Corp',
      role: 'CTO',
      sector: 'fintech',
    });
    expect(prompt).toContain('Acme Corp');
    expect(prompt).toContain('CTO');
    expect(prompt).toContain('fintech');
  });

  // Nouveaux tests pour le flow 5 étapes
  it('contient les 5 sections obligatoires', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('[IDENTITÉ]');
    expect(prompt).toContain('[FLOW 5 ÉTAPES]');
    expect(prompt).toContain('[RÈGLES]');
    expect(prompt).toContain('[FORMAT TAG]');
    expect(prompt).toContain('[FORMAT SORTIE FINALE]');
  });

  it('contient l\'instruction [STEP:N]', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('[STEP:N]');
  });

  it('contient les 5 étapes du flow', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('Étape 1');
    expect(prompt).toContain('Étape 2');
    expect(prompt).toContain('Étape 3');
    expect(prompt).toContain('Étape 4');
    expect(prompt).toContain('Étape 5');
  });

  it('contient l\'instruction de vouvoiement', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('vouvoiement');
  });

  it('ajoute une instruction urgente quand messageCount >= 7', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' }, 7);
    expect(prompt).toContain('[INSTRUCTION URGENTE]');
  });

  it('ne contient pas d\'instruction urgente quand messageCount < 7', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' }, 6);
    expect(prompt).not.toContain('[INSTRUCTION URGENTE]');
  });

  it('n\'ajoute pas l\'instruction urgente par défaut (messageCount = 0)', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).not.toContain('[INSTRUCTION URGENTE]');
  });

  it('injecte le nom du contact quand fourni', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '', contact: 'Jean Dupont' });
    expect(prompt).toContain('Jean Dupont');
  });

  it('demande le prénom si contact absent', () => {
    const prompt = generateSystemPrompt({ company: '', role: '', sector: '' });
    expect(prompt).toContain('prénom');
  });
});
