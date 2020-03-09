class UserInvite {
    token: string;
    inviterId: string;

    constructor(model: UserInvite) {
        if (!model)
            return;

        this.token = model.token;
        this.inviterId = model.inviterId;
    }
}

Object.seal(UserInvite);
export default UserInvite;
