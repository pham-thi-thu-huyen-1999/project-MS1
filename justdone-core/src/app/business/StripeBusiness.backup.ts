import IStripeBusiness from '../business/interfaces/IStripeBusiness'; // eslint-disable-line
import StripeHelper from 'justdone-system-package/dest/helpers/StripeHelper';

class StripeBusiness implements IStripeBusiness {
    async retrieveCoupon(couponId: string): Promise<any> {
        return await StripeHelper.retrieveCoupon(couponId);
    }
}

Object.seal(StripeBusiness);
export default StripeBusiness;
