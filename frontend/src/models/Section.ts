export interface Section {
  id: string;
  title: string;
  slug: string;
  description: string;
  productExternalIds: string[];
}

export interface PageData {
  id: string;
  title: string;
  pageType: string;
  sections: Section[];
}
