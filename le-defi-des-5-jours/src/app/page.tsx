import { parseProspectParams } from '@/lib/params';
import { ensureContrast, generateAccentLight, generateAccentDark } from '@/lib/utils';
import AppShell from '@/components/AppShell';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = parseProspectParams(await searchParams);
  const accent = ensureContrast(params.color);
  const accentLight = generateAccentLight(accent);
  const accentDark = generateAccentDark(accent);

  const accentStyles = {
    '--accent': accent,
    '--accent-light': accentLight,
    '--accent-dark': accentDark,
  } as React.CSSProperties;

  return (
    <div style={accentStyles}>
      <AppShell params={params} />
    </div>
  );
}
