// Map backend Watchlist to app Watchlist
import { PaginatedWatchlists, Watchlist } from '@/types/watchlist';
import { parseMongoDate, parseMongoId } from '@/types/mapper/mongoDbHelper';

export interface BackendWatchlist {
  _id?: { $oid: string } | string;
  id?: string;
  name: string;
  username: string;
  movies_id: string[];
  updated_date?: { $date: string } | string;
}

export interface BackendPaginatedWatchlists {
  pageNo?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  isLast?: boolean;
  elements: BackendWatchlist[];
}

export function mapWatchlist(raw: BackendWatchlist): Watchlist {
  return {
    id: parseMongoId(raw._id ?? raw.id),
    name: raw.name,
    username: raw.username,
    movies_id: Array.isArray(raw.movies_id) ? raw.movies_id : [],
    updated_date: parseMongoDate(raw.updated_date),
  };
}

export function mapPaginatedWatchlists(raw: BackendPaginatedWatchlists): PaginatedWatchlists {
  return {
    pageNo: raw.pageNo ?? 1,
    pageSize: raw.pageSize ?? 10,
    totalElements: raw.totalElements ?? raw.elements.length,
    totalPages: raw.totalPages ?? 1,
    isLast: raw.isLast ?? true,
    elements: (raw.elements ?? []).map(mapWatchlist),
  };
}