export function generateDirectoryMetadata(params: { locale: string; category?: string }) {
  const titles: Record<string, string> = {
    fr: 'Annuaire des établissements lyonnais',
    en: 'Lyon Business Directory',
    es: 'Directorio de negocios de Lyon',
    it: 'Directory delle attività di Lione'
  }

  return {
    title: titles[params.locale] || titles.fr,
    description: 'Découvrez tous les établissements, restaurants, boutiques et services à Lyon'
  }
}