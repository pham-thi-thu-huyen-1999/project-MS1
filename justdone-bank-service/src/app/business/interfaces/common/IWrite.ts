interface IWrite<T> {
    create: (data: T) => Promise<T>;
    update: (_id: string, data: T) => Promise<boolean>;
    delete: (_id: string) => Promise<boolean>;
}

export default IWrite;
