import { fetchApi, fetchApiWithAuth } from '@/lib/api/fetchApi';
import {DetailedMovie, Movie, RecommendationsResponse} from '@/types/movie';
import {mockDetailedMovie} from "@/lib/mock/movieMockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const ENV = process.env.NEXT_PUBLIC_NODE_ENV

export async function searchMovies(query: string): Promise<Movie[]> {
  const url = `${API}/movies/search?q=${encodeURIComponent(query)}`;
  return fetchApi<Movie[]>(url);
}

export async function getRecommendations(userId: string): Promise<RecommendationsResponse> {
  const url = `${API}/mm-recommendation-service/recommend/${userId}?detailed=true`;
  return fetchApiWithAuth<RecommendationsResponse>(url);
}


export async function getMovieById(id: string): Promise<DetailedMovie> {
  if (ENV === 'development') {
    return mockDetailedMovie(id); // return mock
  }

  console.log(ENV)
  return fetchApiWithAuth<DetailedMovie>(
      `${process.env.NEXT_PUBLIC_MOVIES_URL}/mm-movie-service/movies/${id}`
  );
}