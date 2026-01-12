export interface Producer {
  id: string;
  displayName: string;
  slug?: string;
  avatarUrl?: string | null;
}

export interface Track {
  id: string;
  title: string;
  producer: Producer;
  price: number;
  coverImageUrl: string;
  audioUrl: string;
  genre?: string | null;
  bpm?: number | null;
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

