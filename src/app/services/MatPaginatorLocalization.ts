import {MatPaginatorIntl} from '@angular/material/paginator';

const serbianRangeLabel = (page: number, pageSize: number, length: number): string => {
  if (length === 0) {
    return "Страна 1 од 1";
  }
  
  const amountPages = Math.ceil(length / pageSize);
  return `Страна ${page + 1} од ${amountPages}`;
}


export function getSerbianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.firstPageLabel = "Прва страна";
  paginatorIntl.itemsPerPageLabel = "Број ставки по страни:";
  paginatorIntl.lastPageLabel = "Последња страна";
  paginatorIntl.nextPageLabel = 'Следећа страна';
  paginatorIntl.previousPageLabel = 'Предходна страна';
  paginatorIntl.getRangeLabel = serbianRangeLabel;
  
  return paginatorIntl;
}