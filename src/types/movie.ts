export interface Genre {
  id: string; // mapped from Mongo _id
  name: string;
}

export type ActivityType = 'WATCHLISTED' | 'RATED' | string;


export interface Cast {
  firstName: string;
  lastName: string;
}

export interface Director {
  firstName: string;
  lastName: string;
}

export interface Review {
  user: string;
  comment: string;
  rating: number;
  dateCreated: string; // ISO string
}

export interface Rating {
  average: number;
  count: number;
}


export interface DetailedMovie {
  id: string;
  title: string;
  genres: Genre[];
  director: Director;
  casts: Cast[];
  synopsis?: string;
  releaseDate?: string;
  language?: string;
  rating: Rating;
  reviews: Review[];
  posterUrl?: string | null;
}

export interface PaginatedMovies {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  elements: DetailedMovie[];
}





