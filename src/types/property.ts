export type District = {
  id: string;
  name: string;
};

export type Area = {
  id: string;
  name: string;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  role: string;
  whatsapp?: string | null;
  email?: string | null;
};

export type PropertyImage = {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
};

export type PropertyVideo = {
  id: string;
  url: string;
  publicId: string;
  videoType: string;
  thumbnailUrl?: string | null;
};

export type University = {
  id: string;
  name: string;
  shortName?: string | null;
  location?: string | null;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  area?: Area | null;
  status: string;
  district: District;
  contact: Contact;
  images: PropertyImage[];
  videos: PropertyVideo[];
  viewCount: number;
  enquiryCount: number;
  createdAt: string;
  numberOfRooms: number;
  parkingAvailable: boolean;
  isFeatured: boolean;
  featuredUntil?: string | null;
  billingCycle?: string | null;
  totalRooms?: number | null;
  hotelCategory?: string | null;
  furnishingStatus?: string | null;
  floor?: number | null;
  address?: string | null;
  securityDeposit?: number | null;
  availableFrom?: string | null;
  amenities?: string[] | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  university?: University | null;
  listingPurpose: "RENT" | "SALE" | string;
};

export type PropertyQuery = {
  page?: number;
  limit?: number;
  type?: string;
  listingPurpose?: string;
  districtId?: string;
  universityId?: string;
  minPrice?: number;
  maxPrice?: number;
  numberOfRooms?: number;
  search?: string;
  status?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: string;
};