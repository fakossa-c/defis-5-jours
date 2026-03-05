import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const validTypes = ['site-web', 'mvp', 'automatisation', 'dashboard', 'app-mobile'];
  if (!type || !validTypes.includes(type)) {
    return Response.json({ error: 'Type de projet invalide' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('briefs')
    .select('*')
    .eq('project_type', type);

  if (error || !data || data.length === 0) {
    return Response.json({ error: 'Aucun brief disponible' }, { status: 404 });
  }

  // Random pick
  const brief = data[Math.floor(Math.random() * data.length)];

  return Response.json({ brief });
}
