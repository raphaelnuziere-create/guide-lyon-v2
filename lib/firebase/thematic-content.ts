export function getThematicContent(type: string) {
  const content: Record<string, any> = {
    accommodation: {
      title: 'Hébergement à Lyon',
      description: 'Trouvez le meilleur hébergement pour votre séjour à Lyon',
      categories: ['hotels', 'apartments', 'hostels', 'bnb']
    },
    restauration: {
      title: 'Restaurants à Lyon',
      description: 'Découvrez les meilleurs restaurants de Lyon',
      categories: ['traditional', 'gastronomic', 'bistro', 'brasserie']
    }
  }
  
  return content[type] || {}
}