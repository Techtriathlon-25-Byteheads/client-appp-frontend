export interface Service {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  services: Service[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'motor-traffic',
    name: 'Department Of Motor Traffic',
    services: [
      { id: 'drivers-license', name: "Driver's License" },
      { id: 'vehicle-registration', name: 'Vehicle Registration' },
    ]
  },
  {
    id: 'immigration',
    name: 'Immigration & Emigration',
    services: [
      { id: 'passport-applications', name: 'Passport Applications' },
      { id: 'passport-renewals', name: 'Passport Renewals' },
      { id: 'visa-applications', name: 'Visa Applications' },
      { id: 'travel-document', name: 'Travel Document Services' },
    ]
  },
  {
    id: 'person-registration',
    name: 'Person Registration Department',
    services: [
      { id: 'birth-certificate', name: 'Birth Certificate Applications' },
      { id: 'marriage-certificate', name: 'Marriage Certificate Applications' },
      { id: 'death-certificate', name: 'Death Certificate Applications' },
      { id: 'identity-card', name: 'Identity Card Services' },
    ]
  },
  {
    id: 'inland-revenue',
    name: 'Department of Inland Revenue Services',
    services: [
      { id: 'tax-filing', name: 'Tax Filing Services' },
      { id: 'tax-clearance', name: 'Tax Clearance Certificates' },
    ]
  },
  {
    id: 'municipal',
    name: 'Municipal Council Services',
    services: [
      { id: 'building-permits', name: 'Building Permits' },
      { id: 'waste-management', name: 'Waste Management Services' },
    ]
  },
];
