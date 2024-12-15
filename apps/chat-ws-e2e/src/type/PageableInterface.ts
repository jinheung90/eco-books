export interface PageableInterface<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: [
    {
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }
  ],
  numberOfElements: 0,
  pageable: {
    offset: 0,
    sort: [
      {
        direction: string;
        nullHandling: string;
        ascending: boolean;
        property: string;
        ignoreCase: boolean;
      }
    ],
    pageSize: number;
    paged: boolean;
    pageNumber: number;
    unpaged: boolean;
  },
  first: boolean;
  last: boolean;
  empty: boolean;
}
