export class OrderModel {
    public constructor(
        public id?: number,
        public userId?: string,
        public cartId?: number, 
        public totalPrice?: number, 
        public city?: string, 
        public address?: string, 
        public creationDate?: string, 
        public deliveryDate?: string,
        public lastCC?: number) {}
}
