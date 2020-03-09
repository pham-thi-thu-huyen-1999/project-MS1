class InvitationToken {
    accessToken: string;
    tokenExpire: Date;

    constructor(model: InvitationToken) {
        if (!model)
            return;

        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}

Object.seal(InvitationToken);
export default InvitationToken;
