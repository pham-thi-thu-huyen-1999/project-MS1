import {ProductCode, RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';

export default function getUserRoles(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {email: 'super.admin@justdone.com.au', permission: {
            role: RoleCode.SuperAdmin,
            product: ProductCode.Management,
            managers: [],
        }}},
        {isRequired: false, data: {email: 'region.admin@justdone.com.au', permission: {
            role: RoleCode.RegionAdmin,
            product: ProductCode.Management,
            managers: ['super.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'supervisor@justdone.com.au', permission: {
            role: RoleCode.Supervisor,
            product: ProductCode.Management,
            managers: ['super.admin@justdone.com.au', 'region.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'supervisor2@justdone.com.au', permission: {
            role: RoleCode.RegionAdmin,
            product: ProductCode.Management,
            managers: ['super.admin@justdone.com.au', 'region.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'case.manager@justdone.com.au', permission: {
            role: RoleCode.CaseManager,
            product: ProductCode.Management,
            managers: ['super.admin@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'case.manager2@justdone.com.au', permission: {
            role: RoleCode.CaseManager,
            product: ProductCode.Management,
            managers: ['super.admin@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor2@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'product.admin@justdone.com.au', permission: {
            role: RoleCode.ProductAdmin,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'product.manager@justdone.com.au', permission: {
            role: RoleCode.ProductManager,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'product.manager2@justdone.com.au', permission: {
            role: RoleCode.ProductManager,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'felix@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', '.case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'kency@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor2@justdone.com.au', 'product.manager2@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'valadmin@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'nicheal@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'thi@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'justin@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client1@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.Precis,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client2@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.Precis,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor2@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client3@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.Precis,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client4@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor2@justdone.com.au', 'product.manager2@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client5@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager2@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client6@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client7@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor2@justdone.com.au', 'product.manager2@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'client8@justdone.com.au', permission: {
            role: RoleCode.Client,
            product: ProductCode.WhiteLabel,
            managers: ['super.admin@justdone.com.au', 'case.manager@justdone.com.au', 'region.admin@justdone.com.au', 'supervisor@justdone.com.au', 'product.manager@justdone.com.au', 'product.admin@justdone.com.au'],
        }}},
        {isRequired: false, data: {email: 'miloud.kaddache@jetable.pp.ua', permission: {
            role: RoleCode.Client,
            product: ProductCode.Precis,
            managers: ['super.admin@justdone.com.au'],
        }}},
    ];
}
