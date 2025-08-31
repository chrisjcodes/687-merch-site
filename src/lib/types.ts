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