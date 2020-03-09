import ProviderCreate from 'justdone-system-package/dest/app/model/provider/ProviderCreate';
import * as fs from 'fs';
export default function getProviders(): {isRequired: boolean, data: ProviderCreate[]} {
    let content = fs.readFileSync('./src/resources/initialData/providers.json', 'utf8');
    let providers:Array<any> = JSON.parse(content);
    return {
        isRequired: true,
        data: providers.map(provider => {
            provider.bankId = Number(provider.bankId);
            return new ProviderCreate(provider);
        })
    };
}
