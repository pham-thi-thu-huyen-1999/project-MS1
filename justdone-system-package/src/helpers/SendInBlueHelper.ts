// import {Config} from '../config';
// import * as SendInBlue from 'sendinblue-api';
// import WelcomeEmailTemplate from '../resources/templates/intercom/WelcomeMail';

// const ProductType = ['Precis', 'WhiteLabel', 'Client', 'Management'];

export default class SendInBlueHelper {
    // static async sendWelcomeEmail(productType: number, userReceiver: any, subject?: string) {
    //     let emailTemplate = new WelcomeEmailTemplate(userReceiver.firstName);
    //     let message = createAutoMessage(productType, userReceiver, emailTemplate, subject);
    //     return await sendEmail(message);
    // }
}

// function createAutoMessage(productType: number, userReceiver: any, emailTemplate: any, subject?: string) {
//     let product: any = ProductType[productType].match(/[A-Z][a-z]+/g);
//     let productName = '';
//     product.forEach(item => {
//         item = capitalize(item);
//         productName += item + ' ';
//     });
//     productName = productName.slice(0, -1);
//     return {
//         'from': [`autoresponder@${ProductType[productType].trim().toLowerCase()}.com.au`, `Auto-Responder from ${productName}`],
//         'to': toAssociateObject(userReceiver),
//         'subject': subject ? subject : `Welcome to ${productName}!`,
//         'html': emailTemplate.getTemplate()
//     };
// }

// function sendEmail(message: any) {
//     return new Promise((resolve, reject) => {
//         let sendInBlueClient = new SendInBlue({'apiKey': Config.PROJECT.SENDINBLUE.API_KEY, 'timeout': 10000});
//         sendInBlueClient.send_email(message, (err, response) => {
//             if (err)
//                 reject(err);
//             else
//                 resolve(response);
//         });
//     });
// }

// function toAssociateObject(listUser: any) {
//     let result = {};
//     if (listUser.email && listUser.firstName && listUser.lastName)
//         result[listUser['email'].trim().toLowerCase()] = listUser['firstName'] + listUser['lastName'];
//     else
//         listUser.forEach(item => {
//             result[item['email'].trim().toLowerCase()] = item['firstName'] + item['lastName'];
//         });
//     return result;
// }

// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }
