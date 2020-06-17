export class ShoppingCartItemModel {
    public constructor(
        public id?: number,
        public productName?: string,
        public productId?: number,
        public quantity?: number,
        public totalPrice?: number,
        public productImageName?: string,
        public cartId?: number,
        public highlight?: boolean) {}
}
