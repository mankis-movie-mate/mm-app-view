import { IS_DEV } from '@/lib/constants/global';
import { mockRecommendations } from '@/lib/mock/mockRecommendationData';
import { fetchApiWithAuth } from '@/lib/api/fetchApi';
import { RecommendationsResponse } from '@/types/recommendation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const RECOMMENDATION_URL = `${API}/mm-recommendation-service`;

export async function getRecommendations(
  userId: number | string,
): Promise<RecommendationsResponse> {
  if (IS_DEV) {
    return mockRecommendations;
  }
  if (userId) {
    const url = `${RECOMMENDATION_URL}/recommend/${userId}?detailed=true`;
    return fetchApiWithAuth<RecommendationsResponse>(url);
  }
  return { recommended: [], userId: '' };
}
