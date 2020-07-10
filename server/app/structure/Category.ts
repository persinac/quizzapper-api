interface ICategory {
    categoryID?: number;
    label: string;
    typeOfCategory: number;
    createdBy: string;
    createdDatetime: Date;
    modifiedBy: string;
    modifiedDatetime: Date;
    isActive: number;
}

export default ICategory;