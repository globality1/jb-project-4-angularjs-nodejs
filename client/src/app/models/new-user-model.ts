export class NewUserModel {
    public constructor(
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public personalId?: number,
        public password?: string,
        public confirmPassword?: string,
        public city?: string,
        public address?: string) {}
}
