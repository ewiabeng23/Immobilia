export const CITIES = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Buea', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi'
]

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'House', 'Studio', 'Office', 'Land', 'Warehouse']

export const mockProperties = [
  {
    id: '1', title: 'Modern Duplex in Bonanjo',
    listing_type: 'rent', property_type: 'Villa',
    price: 350000, city: 'Douala', neighborhood: 'Bonanjo',
    bedrooms: 4, bathrooms: 3, area: 280,
    description: 'Stunning modern duplex in the heart of Bonanjo with panoramic city views, premium finishes, 24/7 security, and covered parking. Perfect for executives or expats.',
    amenities: ['Pool','Generator','Security','Parking','AC','Garden'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80'],
    verified: true, featured: true, created_at: '2025-03-10',
    agent: { name: 'Ngozi Amara', phone: '655123456', avatar: 'NA' }
  },
  {
    id: '2', title: 'Luxury Apartment Bastos',
    listing_type: 'rent', property_type: 'Apartment',
    price: 180000, city: 'Yaoundé', neighborhood: 'Bastos',
    bedrooms: 3, bathrooms: 2, area: 145,
    description: 'Elegant 3-bedroom apartment in prestigious Bastos, fully furnished with high-end appliances, fiber internet, and concierge service.',
    amenities: ['Furnished','Fiber Internet','Security','Parking','AC'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80'],
    verified: true, featured: true, created_at: '2025-03-12',
    agent: { name: 'Jean-Paul Mbida', phone: '677234567', avatar: 'JM' }
  },
  {
    id: '3', title: 'Contemporary Villa with Pool',
    listing_type: 'buy', property_type: 'Villa',
    price: 95000000, city: 'Douala', neighborhood: 'Bonapriso',
    bedrooms: 5, bathrooms: 4, area: 450,
    description: 'Magnificent contemporary villa in Bonapriso with private pool, tropical garden, smart home system, and stunning architecture.',
    amenities: ['Pool','Smart Home','Generator','Security','Parking','Garden','AC'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80'],
    verified: true, featured: true, created_at: '2025-03-08',
    agent: { name: 'Martine Foko', phone: '699345678', avatar: 'MF' }
  },
  {
    id: '4', title: 'Studio — Idéal Étudiant',
    listing_type: 'rent', property_type: 'Studio',
    price: 45000, city: 'Yaoundé', neighborhood: 'Melen',
    bedrooms: 0, bathrooms: 1, area: 35,
    description: 'Studio compact et propre près de l\'Université de Yaoundé I. Tout le nécessaire dans un agencement moderne. Charges comprises.',
    amenities: ['WiFi','Security','AC'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80'],
    verified: false, featured: false, created_at: '2025-03-15',
    agent: { name: 'Pierre Ondoua', phone: '650456789', avatar: 'PO' }
  },
  {
    id: '5', title: 'Terrain Bord de Mer — Kribi',
    listing_type: 'sell', property_type: 'Land',
    price: 28000000, city: 'Kribi', neighborhood: 'Centre',
    bedrooms: null, bathrooms: null, area: 1000,
    description: 'Terrain de choix en bord de mer à Kribi, à 100m de la plage. Titre foncier disponible. Idéal pour hôtel, resort ou résidence.',
    amenities: ['Title Deed','Seafront','Road Access'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80'],
    verified: true, featured: false, created_at: '2025-03-05',
    agent: { name: 'Alain Tchamba', phone: '670567890', avatar: 'AT' }
  },
  {
    id: '6', title: 'Bureau Premium — Akwa',
    listing_type: 'rent', property_type: 'Office',
    price: 220000, city: 'Douala', neighborhood: 'Akwa',
    bedrooms: null, bathrooms: 2, area: 180,
    description: 'Bureau open-space premium au 8ème étage d\'un immeuble de catégorie A à Akwa. Baies vitrées, salles de réunion, parking et accès 24h/24.',
    amenities: ['Generator','Parking','Meeting Rooms','AC','Fiber Internet','Security'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80'],
    verified: true, featured: true, created_at: '2025-03-11',
    agent: { name: 'Ngozi Amara', phone: '655123456', avatar: 'NA' }
  },
  {
    id: '7', title: 'Maison familiale 4 chambres',
    listing_type: 'buy', property_type: 'House',
    price: 42000000, city: 'Bafoussam', neighborhood: 'Résidentiel',
    bedrooms: 4, bathrooms: 3, area: 220,
    description: 'Belle maison familiale de 4 chambres avec cour fermée, dépendance et manguiers. Titre foncier disponible. Quartier résidentiel calme.',
    amenities: ['Garden','Parking','Generator','Security'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80'],
    verified: true, featured: false, created_at: '2025-03-01',
    agent: { name: 'Céleste Nkeng', phone: '690678901', avatar: 'CN' }
  },
  {
    id: '8', title: 'Studio Bord de Mer — Kribi',
    listing_type: 'rent', property_type: 'Studio',
    price: 65000, city: 'Kribi', neighborhood: 'Beach Road',
    bedrooms: 0, bathrooms: 1, area: 45,
    description: 'Studio charmant à 30 mètres de la plage. Parfait comme résidence de vacances ou logement permanent. Entièrement meublé.',
    amenities: ['Furnished','WiFi','Seafront'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80'],
    verified: false, featured: false, created_at: '2025-03-18',
    agent: { name: 'Alain Tchamba', phone: '670567890', avatar: 'AT' }
  }
]

export const formatPrice = (price, listingType, lang = 'fr') => {
  const formatted = new Intl.NumberFormat('fr-FR').format(price)
  const suffix = listingType === 'rent' ? (lang === 'fr' ? ' FCFA/mois' : ' FCFA/month') : ' FCFA'
  return `${formatted}${suffix}`
}

export const CITY_IMAGES = {
  'Douala':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Yaoundé':   'https://images.unsplash.com/photo-1523413184730-e85dbbd902bf?w=600&q=80',
  'Bafoussam': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  'Kribi':     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'Bamenda':   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  'Garoua':    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
  'Buea':      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80',
}
