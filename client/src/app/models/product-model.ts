export class ProductModel {
    public constructor(
        public id?: number,
        public productName?: string,
        public productPrice?: number,
        public productCategoryId?: number,
        public productImage?: File,
        public productImageName?: string) {}
}
