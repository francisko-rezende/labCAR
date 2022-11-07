import { Rider } from 'src/riders/riders.entity';

interface PaginationMeta {
  page: number;
  size: number;
}

export interface GetRidersReturn {
  data: Rider[];
  next?: PaginationMeta;
  previous?: PaginationMeta;
}
