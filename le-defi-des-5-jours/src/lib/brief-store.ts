// Stockage en mémoire des credentials des briefs soumis
// key: normalizedCompany, value: email normalisé
const briefCredentials = new Map<string, string>();

// Suivi des soumissions de briefs pour détection de doublons
// key: nom société normalisé, value: true
const submittedCompanies = new Map<string, boolean>();

function normalizeCompany(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function storeBriefCredentials(company: string, email: string): void {
  briefCredentials.set(normalizeCompany(company), email.toLowerCase().trim());
}

export function verifyBriefCredentials(company: string, email: string): boolean {
  const stored = briefCredentials.get(normalizeCompany(company));
  return stored === email.toLowerCase().trim();
}

export function checkDuplicateSubmission(company: string): boolean {
  return submittedCompanies.has(normalizeCompany(company));
}

export function markCompanySubmitted(company: string): void {
  submittedCompanies.set(normalizeCompany(company), true);
}
