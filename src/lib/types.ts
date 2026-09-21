export type ProductionModel = 'traditional' | 'flexible' | 'mobile';

export type WorkItem = {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  year?: number;
  productionModel?: ProductionModel;
  context?: string;
};

export type Partner = {
  name: string;
  logo: string;
  url?: string;
};