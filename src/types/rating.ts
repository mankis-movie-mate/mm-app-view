export interface SubmitRatingPayload {
  movie_id: string;
  username: string;
  rate: number;              // e.g. 1–5
  review: string;
  tags: string[];
}

export interface MovieRating extends SubmitRatingPayload {
  id: string;
  created_at?: string;
  updated_at?: string;
}