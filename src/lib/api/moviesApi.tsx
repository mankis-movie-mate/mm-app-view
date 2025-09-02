import { fetchApi, fetchApiWithAuth } from '@/lib/api/fetchApi';
import { Movie, RecommendationsResponse } from '@/types/movie';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function searchMovies(query: string): Promise<Movie[]> {
  // Adjust the endpoint to match your backend
  const url = `${API}/movies/search?q=${encodeURIComponent(query)}`;
  return fetchApi<Movie[]>(url);
}

export async function getRecommendations(userId: string): Promise<RecommendationsResponse> {
  const url = `${API}/mm-recommendation-service/recommend/${userId}?detailed=true`;

  return fetchApiWithAuth<RecommendationsResponse>(url);
}
