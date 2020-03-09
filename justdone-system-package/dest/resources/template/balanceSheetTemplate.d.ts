declare const balanceSheetTemplate: {
    name: string;
    type: number;
    items: ({
        code: number;
        name: string;
        items: ({
            code: number;
            name: string;
            items?: undefined;
        } | {
            code: number;
            name: string;
            items: {
                code: number;
                name: string;
            }[];
        })[];
    } | {
        code: number;
        name: string;
        items?: undefined;
    })[];
};
export default balanceSheetTemplate;
