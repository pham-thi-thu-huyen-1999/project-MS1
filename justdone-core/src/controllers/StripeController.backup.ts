import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IStripeBusiness from '../app/business/interfaces/IStripeBusiness';
class StripeController extends BaseController {
    private stripeBusiness: IStripeBusiness = BusinessLoader.stripeBusiness;

    constructor() {
        super();

        this.get('/retrieve-coupon/:couponId', this.retrieveCoupon.bind(this));
    }

    async retrieveCoupon(req): Promise<any> {
        return await this.stripeBusiness.retrieveCoupon(req.params.couponId);
    }
}

Object.seal(StripeController);
export default StripeController;
