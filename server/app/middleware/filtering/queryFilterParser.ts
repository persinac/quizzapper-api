import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { IFilterQuery } from "../../structure/QueryParams/IQueryParams";

export class QueryFilterParser {
    public static buildWhereClause(queryBuilder: SelectQueryBuilder<any>, filters: IFilterQuery[], alias): SelectQueryBuilder<any> {
        // const tempQs = [
        //     { operator: "IN", column: "difficulty", value: ["Medium", "Easy"]},
        //     { operator: "LIKE", column: "question", value: "t"},
        //     { operator: "=", column: "questionId", value: 10}
        // ];
        filters.forEach((v, idx) => {
            if (v.value !== null && v.value.toString().length > 0) {
                let query = `${alias}.${v.column} ${v.operator} `;
                switch (v.operator) {
                    case "LIKE":
                        query = query.concat(`'%${v.value.toString()}%'`);
                        break;
                    case "IN":
                        query = query.concat(`(:...${v.column})`);
                        break;
                    default:
                        if (typeof v.value === "string") {
                            query = query.concat(`"${v.value.toString()}"`);
                        } else {
                            query = query.concat(`${Number.parseInt(v.value.toString())}`);
                        }
                }

                console.log(query);
                if (idx === 0) {
                    if (v.operator === "IN") {
                        queryBuilder = queryBuilder.where(query, {[v.column]: v.value});
                    } else {
                        queryBuilder = queryBuilder.where(query);
                    }
                } else {
                    if (v.operator === "IN") {
                        queryBuilder = queryBuilder.andWhere(query, {[v.column]: v.value});
                    } else {
                        queryBuilder = queryBuilder.andWhere(query);
                    }
                }
            }
        });
        return queryBuilder;
    }
}