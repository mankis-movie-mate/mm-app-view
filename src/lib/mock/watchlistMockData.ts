import { PaginatedWatchlists } from '@/types/watchlist';

export const devMockWatchlists: PaginatedWatchlists = {
  pageNo: 1,
  pageSize: 2,
  totalElements: 2,
  totalPages: 1,
  isLast: true,
  elements: [
    {
      id: 'wl1',
      name: 'Sci-Fi Favorites',
      username: 'admin',
      movies_id: ['m1', 'm2'],
      updated_date: '2024-01-01T10:00:00Z',
    },
    {
      id: 'wl2',
      name: 'Must Watch',
      username: 'admin',
      movies_id: ['m3', 'm4'],
      updated_date: '2024-02-01T12:00:00Z',
    },
  ],
};
