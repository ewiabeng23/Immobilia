export const CITIES = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Buea', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi'
]

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'House', 'Studio', 'Office', 'Land', 'Warehouse']

export const mockProperties = []

export const formatPrice = (price, listingType, lang = 'fr') => {
  const formatted = new Intl.NumberFormat('fr-FR').format(price)
  const suffix = listingType === 'rent' ? (lang === 'fr' ? ' FCFA/mois' : ' FCFA/month') : ' FCFA'
  return `${formatted}${suffix}`
}

export const CITY_IMAGES = {
  'Douala':    'https://cxpxlvgchyvbxhhwnnlh.supabase.co/storage/v1/object/public/property-image/properties/Douala.png',
  'Yaoundé':   'https://cxpxlvgchyvbxhhwnnlh.supabase.co/storage/v1/object/public/property-image/properties/Yaounde.png',
  'Bafoussam': 'https://cxpxlvgchyvbxhhwnnlh.supabase.co/storage/v1/object/public/property-image/properties/Baff.jpg',
  'Bamenda':   'https://cxpxlvgchyvbxhhwnnlh.supabase.co/storage/v1/object/public/property-image/properties/Bamenda.png',
  'Kribi':     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'Buea':      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80',
  'Garoua':    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
}
