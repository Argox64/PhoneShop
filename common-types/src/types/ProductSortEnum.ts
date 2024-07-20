export enum ProductSortEnum {
    Name = "Name",
    Price = "Price",
    Sales = "Sales",
}

export function convertStrToEnum(convertingStr: string): ProductSortEnum 
| undefined {
    if (Object.values(ProductSortEnum).includes(convertingStr as ProductSortEnum)) {
        return convertingStr as ProductSortEnum;
    } else {
        return undefined;
    }
}