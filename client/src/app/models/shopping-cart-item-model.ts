export class ShoppingCartItemModel {
    public constructor(
        public productName?: string,
        public productId?: number,
        public quantity?: number,
        public totalPrice?: number,
        public productImageName?: string,
        public cartId?: number) {}
}
