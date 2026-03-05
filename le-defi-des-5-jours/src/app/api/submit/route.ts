import { supabase } from '@/lib/supabase';

function extractDomain(email: string): string | null {
  const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
  if (!match) return null;
  const domain = match[1].toLowerCase();
  // Rejeter les domaines email generiques
  const genericDomains = [
    'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr',
    'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'icloud.com',
    'protonmail.com', 'proton.me', 'mail.com', 'aol.com', 'gmx.com',
    'gmx.fr', 'free.fr', 'orange.fr', 'sfr.fr', 'laposte.net',
    'wanadoo.fr', 'yandex.com', 'zoho.com',
  ];
  if (genericDomains.includes(domain)) return null;
  return domain;
}

export async function POST(req: Request) {
  let body: {
    email?: string;
    project_type?: string;
    brief_id?: string;
    notes?: string;
    contact_method?: string;
    company?: string;
    sector?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { email, project_type, brief_id, notes, contact_method, company, sector } = body;

  // Validations
  if (!email || !project_type || !brief_id || !contact_method) {
    return Response.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Email invalide' }, { status: 400 });
  }

  const domain = extractDomain(email);
  if (!domain) {
    return Response.json(
      { error: 'Merci d\'utiliser votre adresse email professionnelle (pas de Gmail, Yahoo, etc.)' },
      { status: 400 },
    );
  }

  const validTypes = ['site-web', 'mvp', 'automatisation', 'dashboard', 'app-mobile'];
  if (!validTypes.includes(project_type)) {
    return Response.json({ error: 'Type de projet invalide' }, { status: 400 });
  }

  const validMethods = ['visio', 'email', 'telephone'];
  if (!validMethods.includes(contact_method)) {
    return Response.json({ error: 'Methode de contact invalide' }, { status: 400 });
  }

  // Insert (domain unique constraint handles duplicates)
  const { error } = await supabase.from('submissions').insert({
    email: email.toLowerCase().trim(),
    domain,
    project_type,
    brief_id,
    notes: notes?.trim() || null,
    contact_method,
    company: company?.trim() || null,
    sector: sector?.trim() || null,
  });

  if (error) {
    if (error.code === '23505') {
      return Response.json(
        { error: 'Une demande a deja ete soumise depuis cette entreprise. Un seul defi par societe.' },
        { status: 409 },
      );
    }
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }

  return Response.json({ success: true });
}
