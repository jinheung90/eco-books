


export class PageResult<T> {
  private totalElements: number;
  private totalPages: number;
  private size: number;
  private content: T[];
  private number: number;
  private sort: Array<PageSort>;
  private numberOfElements;
  private pageable: Pageable;
  private first: boolean;
  private last: boolean;
  private empty: boolean;

  constructor(page: number, size: number, totalElements: number, content: T[]) {
    this.size = size;
    this.totalElements = totalElements;
    this.content = content;
    this.pageable = {
      paged: true,
      pageSize: size,
      pageNumber: page,
      sort: [],
      offset: page * size,
      unpaged: false
    }
    if(content.length === 0) {
      this.empty = true;
    }
    this.sort = [];
    if(page === 0) {
      this.first = true;
    } else {
      this.first = false;
    }

    const remainder = totalElements % size;
    const addPage = remainder % size > 0 ? 1 : 0;
    this.totalPages = totalElements / size + addPage;
    this.number = page;

    if(this.totalPages - 1 === this.number) {
      this.last = true;
    } else {
      this.last = false;
    }

    if(!this.last || remainder === 0) {
      this.numberOfElements = size;
    } else {
      this.numberOfElements = remainder;
    }

    if(this.numberOfElements === 0) {
      this.empty = true;
    } else {
      this.empty = false;
    }
  }
}

export interface PageSort {
  empty: boolean,
  sorted: boolean,
  unsorted: boolean
}

export interface Pageable {
  offset: number;
  sort: Array<PageSort>;
  pageSize: number;
  paged: boolean;
  pageNumber: number;
  unpaged: boolean;
}
