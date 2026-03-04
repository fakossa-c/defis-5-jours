// Stockage en mémoire des credentials des briefs soumis
// key: normalizedCompany, value: email normalisé
const briefCredentials = new Map<string, string>();

export function storeBriefCredentials(company: string, email: string): void {
  briefCredentials.set(
    company.toLowerCase().trim(),
    email.toLowerCase().trim()
  );
}

export function verifyBriefCredentials(company: string, email: string): boolean {
  const stored = briefCredentials.get(company.toLowerCase().trim());
  return stored === email.toLowerCase().trim();
}
