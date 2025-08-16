export const SRI_LANKA_CITIES = [
  'Colombo',
  'Sri Jayawardenepura Kotte',
  'Dehiwala-Mount Lavinia',
  'Moratuwa',
  'Negombo',
  'Kandy',
  'Kalmunai',
  'Trincomalee',
  'Galle',
  'Jaffna',
  'Kurunegala',
  'Matale',
  'Katunayake',
  'Dambulla',
  'Anuradhapura',
  'Ratnapura',
  'Badulla',
  'Matara',
  'Puttalam',
  'Vavuniya',
  'Panadura'
] as const;

export type SriLankaCity = typeof SRI_LANKA_CITIES[number];
