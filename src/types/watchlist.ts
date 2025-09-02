export interface Watchlist {
    id: string;
    name: string;
    username: string;
    movies_id: string[];
    updated_date: string; // ISO format
}

export interface PaginatedWatchlists {
    elements: Watchlist[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLast: boolean;
}