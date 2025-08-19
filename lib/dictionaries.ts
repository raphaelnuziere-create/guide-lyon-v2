const dictionaries = {
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  es: () => import('../dictionaries/es.json').then((module) => module.default),
  it: () => import('../dictionaries/it.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  const dict = dictionaries[locale as keyof typeof dictionaries]
  if (!dict) {
    return dictionaries.fr()
  }
  return dict()
}