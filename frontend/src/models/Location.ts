export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  idProvince: string;
}

export interface Commune {
  id: string;
  name: string;
  idDistrict: string;
}
