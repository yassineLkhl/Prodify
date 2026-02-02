export interface Producer {
  id: string;
  displayName: string;
  slug?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface Track {
  id: string;
  title: string;
  producer: Producer;
  price: number;
  coverImageUrl: string;
  audioUrl: string;
  description?: string | null;
  genre?: string | null;
  bpm?: number | null;
  mood?: string | null;
}

export interface TrackRequest {
  title: string;
  description?: string;
  price: number;
  bpm?: number;
  genre?: string;
  mood?: string;
  coverImageUrl: string;
  audioUrl: string;
}

export interface TrackSearchCriteria {
  title?: string;
  genre?: string;
  mood?: string;
  minBpm?: number;
  maxBpm?: number;
  minPrice?: number;
  maxPrice?: number;
}
