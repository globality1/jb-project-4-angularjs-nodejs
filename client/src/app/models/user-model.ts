export class UserModel {
    public constructor(
        public uuid?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public personalId?: number,
        public city?: string,
        public address?: string,
        public isAdmin?: number, 
        public token?: string) {}
}
