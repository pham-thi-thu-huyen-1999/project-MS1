class InitialData {
    isRequired?: boolean;

    async init(isRequired?: boolean): Promise<void> {
        this.isRequired = isRequired;

        // console.log('Initial Data ===> Done.');
    }
}

Object.seal(InitialData);
export default InitialData;
