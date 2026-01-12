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

