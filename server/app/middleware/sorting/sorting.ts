import { ISort } from "../../structure/QueryParams/IQueryParams";
import { TSMap } from "typescript-map";

export class Sorting {
    private static DEFAULT_SORT: ISort[] =  [];

    public static getSortingForQuery(requestBody: any, alias: string, defaultSort: ISort[]): TSMap<string, ("ASC" | "DESC")> {
        const s = new TSMap<string, ("ASC" | "DESC")>();

        const sortToUse: ISort[] = requestBody.sort !== undefined ? requestBody.sort : defaultSort;

        /***
        * TS Lint complains about <string, string> because of the declared type: OrderByCondition
        * So I just took the declaration of the type and made it the value of the key value pair
        * and it doesn't complain anymore.
        ****/
        sortToUse.forEach((st: ISort) => {
            let ascOrDesc: ("ASC" | "DESC") = "ASC";
            if (st.ascDesc !== undefined) {
                if (st.ascDesc === "ASC") {
                    ascOrDesc = "ASC";
                } else {
                    ascOrDesc = "DESC";
                }
            }
            s.set(`${alias}.${st.sortBy}`, ascOrDesc);
        });

        return s;
    }
}