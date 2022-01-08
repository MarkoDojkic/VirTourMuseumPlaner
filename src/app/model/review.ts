import { Visitor } from './visitor';
export interface Review {
    id: string;
    reviewer: Visitor;
    comment: string;
    rating: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
