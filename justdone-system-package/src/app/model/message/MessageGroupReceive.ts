
class MessageGroupReceive {
    role: number;
    product: number;

    constructor(model: MessageGroupReceive) {
        if (!model)
            return;

        this.role = model.role;
        this.product = model.product;
    }
}

Object.seal(MessageGroupReceive);
export default MessageGroupReceive;
