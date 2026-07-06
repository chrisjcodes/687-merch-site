export type WorkItem = {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  year?: number;
};

export type Partner = {
  name: string;
  logo: string;
  url?: string;
};

export type OwnerResponse = {
  date_relative: string;
  text: string;
};

export type Review = {
  reviewer_name: string;
  reviewer_badge?: string;
  reviewer_reviews_count: number;
  reviewer_photos_count: number;
  rating: number;
  date_relative: string;
  review_text: string;
  owner_response?: OwnerResponse;
};

export type BusinessInfo = {
  name: string;
  category: string;
  overall_rating: number;
  total_reviews: number;
  address: string;
  phone: string;
  website: string;
};

export type TestimonialsData = {
  business: BusinessInfo;
  reviews: Review[];
};