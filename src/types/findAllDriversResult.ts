import { Driver } from 'src/drivers/driver.entity';

interface PaginationMeta {
  page: number;
  size: number;
}

export interface FindAllDriversResult {
  data: Driver[];
  next?: PaginationMeta;
  previous?: PaginationMeta;
}
