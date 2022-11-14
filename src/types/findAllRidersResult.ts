import { Rider } from 'src/riders/riders.entity';

interface PaginationMeta {
  page: number;
  size: number;
}

export interface FindAllRidersResult {
  data: Rider[];
  next?: PaginationMeta;
  previous?: PaginationMeta;
}
