export function generateSystemPrompt(context: {
  company: string;
  role: string;
  sector: string;
}): string {
  const parts = [
    `Tu es un consultant IA spécialisé dans la définition de projets digitaux.`,
    `Tu guides le prospect à travers "Le Défi des 5 Jours" pour définir son projet.`,
    `Tu poses des questions précises, une à la fois, pour comprendre le besoin.`,
    `Tu es professionnel, bienveillant et concis.`,
    `Tu réponds toujours en français.`,
  ];

  if (context.company) {
    parts.push(`L'entreprise du prospect est "${context.company}".`);
  }
  if (context.role) {
    parts.push(`Le rôle du prospect est "${context.role}".`);
  }
  if (context.sector) {
    parts.push(`Le secteur d'activité est "${context.sector}".`);
  }

  return parts.join('\n');
}
