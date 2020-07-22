export interface IPagination {
    startIndex: number;
    batchSize: number;
}

export interface ISort {
    sortBy: string;
    ascDesc: string;
}

export interface ISortForQuery {
    [name: string]: string;
}