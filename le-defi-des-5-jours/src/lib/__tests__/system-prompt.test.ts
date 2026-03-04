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
});
