import { IPagination } from "../../structure/QueryParams/IQueryParams";

export class Pagination {
    private static DEFAULT_PAGING: IPagination = {startIndex: 0, batchSize: 25};

    public static getPaginationForQuery(requestBody: any): IPagination {
        return requestBody.pagination !== undefined ? requestBody.pagination : this.DEFAULT_PAGING;
    }
}