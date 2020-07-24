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

export interface IFilterQuery {
    operator: string;
    column: string;
    value: string | number | string[];
}