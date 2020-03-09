import { LoginProvider } from '../common/CommonType';
declare class UserToken {
    provider: LoginProvider;
    providerName: string;
    accessToken: string;
    tokenExpire: Date;
    constructor(model: UserToken);
}
export default UserToken;
