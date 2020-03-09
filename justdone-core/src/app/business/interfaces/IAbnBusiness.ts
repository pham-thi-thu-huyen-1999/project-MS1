
interface IAbnBusiness {
    abnLookUp(productCodeAuth: number, roleCodeAuth: number, keyWord: string) : Promise<any>;
    abnUKLookUp(keyWord: string) : Promise<any>;
}

export default IAbnBusiness;
