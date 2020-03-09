import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate';
import {ProductCode, FileType} from 'justdone-system-package/dest/app/model/common/CommonType';

export default function getFiles(): {isRequired: boolean, data: FileCreate}[] {
    return [
        {isRequired: false, data: <FileCreate>
            {
                userId: 'super.admin@justdone.com.au',
                productCode: ProductCode.Management,
                name: 'Management_Product_Logo',
                size: 100,
                url: 'Management_Product_Logo.png',
                type: FileType.Image,
                extension: 'png',
                prefix: '/product'
            }
        }, {isRequired: false, data: <FileCreate>
            {
                userId: 'super.admin@justdone.com.au',
                productCode: ProductCode.Justdone,
                name: 'Justdone_Product_Logo',
                size: 100,
                url: 'Justdone_Product_Logo.png',
                type: FileType.Image,
                extension: 'png',
                prefix: '/product'
            }
        }, {isRequired: false, data: <FileCreate>
            {
                userId: 'super.admin@justdone.com.au',
                productCode: ProductCode.Precis,
                name: 'Precis_Product_Logo',
                size: 100,
                url: 'Precis_Product_Logo.png',
                type: FileType.Image,
                extension: 'png',
                prefix: '/product'
            }
        }, {isRequired: false, data: <FileCreate>
            {
                userId: 'super.admin@justdone.com.au',
                productCode: ProductCode.WhiteLabel,
                name: 'White_Label_Product_Logo',
                size: 100,
                url: 'White_Label_Product_Logo.png',
                type: FileType.Image,
                extension: 'png',
                prefix: '/product'
            }
        },
    ];
}
