import UserBusinessInfo from 'justdone-system-package/dest/app/model/user/UserBusinessInfo'; // eslint-disable-line
import UserPersonalInfo from 'justdone-system-package/dest/app/model/user/UserPersonalInfo'; // eslint-disable-line
import UserCreate from 'justdone-system-package/dest/app/model/user/UserCreate'; // eslint-disable-line
import {ProductType} from 'justdone-system-package/dest/app/model/common/CommonType';
import {GenderType} from 'justdone-system-package/dest/app/model/common/CommonType';
import {UserStatus} from 'justdone-system-package/dest/app/model/common/CommonType';

export default function getUsers(): { isRequired: boolean, data: UserCreate }[] {
    let userJustdone = {
        isRequired: false,
        data: {
            ...new UserCreate(<any>{
                email: 'aragon@justdone.com.au',
                password: 'Kitty123!',
                firstName: 'Hung',
                lastName: 'Nguyen',
                avatar: undefined,
                gender: GenderType.Male,
                activationKey: 'hungnguyen88',
                status: UserStatus.Active,
                personalInfo: <UserPersonalInfo>{
                    birthday: new Date(1990, 11, 18),
                    phone: '0969696969'
                },
                productType: ProductType.WhiteLabel,
                connectedBanks: [{
                    currentBalance: 0,
                    type: 1,
                    providerId: 17220160,
                    connectedId: '',
                    connectedName: '',
                    bankId: ''
                }, {
                    currentBalance: 0,
                    type: 2,
                    providerId: 17220160,
                    connectedId: '',
                    connectedName: ''
                }]
            }), _id: '59e6dea04582e457addabdd4',
        }
    };

    let listUser: any = [{
        isRequired: true,
        data: new UserCreate(<any>{
            email: 'super.admin@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Admin',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'superadminAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1989, 8, 8),
                phone: '0912454236'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'region.admin@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Region Admin',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'regionAdminAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'supervisor@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Supervisor',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'supervisorAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'supervisor2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Supervisor2',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'supervisorAuthenActivateKey2',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544663'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'product.admin@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'WhiteLabel',
            lastName: 'Admin',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'productAdmin',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'product.manager@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'WhiteLabel',
            lastName: 'Manager',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'productManager',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'product.manager2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Product',
            lastName: 'Manager 2',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'productManager2',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 19),
                phone: '0914544662'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'case.manager@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Manager',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'managerAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'case.manager2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Manager 2',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'managerAuthenActivateKey2',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client1@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client1',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client2',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client3@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client3',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client4@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client4',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client5@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client5',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client6@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client6',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client7@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client7',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client8@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'client8',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.WhiteLabel,
            activationKey: 'clientAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'advisor@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Advisor',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'advisorAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'advisor2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Advisor2',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'advisor2AuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'tax.agent@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Tax Agent',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'taxAgentAuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'tax.agent2@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justdone',
            lastName: 'Tax Agent2',
            avatar: undefined,
            gender: GenderType.Male,
            productType: ProductType.Management,
            activationKey: 'taxAgent2AuthenActivateKey',
            status: UserStatus.Active,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'kency@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Kency',
            lastName: 'Nguyen',
            avatar: undefined,
            gender: GenderType.Male,
            activationKey: 'kencynguyen88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            },
            businessInfo: <UserBusinessInfo>{
                abnCode: '10029',
                entityName: 'TNC',
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'justin@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Justin',
            lastName: 'Nguyen',
            avatar: undefined,
            gender: GenderType.Male,
            activationKey: 'justinnguyen88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            },
            businessInfo: <UserBusinessInfo>{
                abnCode: '10029',
                entityName: 'TNC',
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'felix@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Felix',
            lastName: 'Le',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'felixle88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'nicheal@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Nicheal',
            lastName: 'Pham',
            avatar: undefined,
            gender: GenderType.Male,
            activationKey: 'nichealpham88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'thi@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Thi',
            lastName: 'Nguyen',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'thinguyen88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'valadmin@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Valadmin',
            lastName: 'Le',
            avatar: undefined,
            gender: GenderType.Male,
            activationKey: 'valadmin88',
            status: UserStatus.Active,
            productType: ProductType.WhiteLabel,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '1233454565'
            }
        })
    }, {
        isRequired: false,
        data: new UserCreate(<any>{
            email: 'client.percis@justdone.com.au',
            password: 'Kitty123!',
            firstName: 'Miloud',
            lastName: 'Kaddache',
            avatar: undefined,
            gender: GenderType.Female,
            activationKey: 'miloud.kaddache',
            status: UserStatus.Active,
            productType: ProductType.FreshNumber,
            personalInfo: <UserPersonalInfo>{
                birthday: new Date(1990, 11, 18),
                phone: '0914544661'
            }
        })
    }];

    if (['Development', 'Cloud'].find(env => env === process.env.NODE_ENV))
        listUser.push(userJustdone);

    return listUser;
};
