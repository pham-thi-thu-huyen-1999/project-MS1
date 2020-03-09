interface IStripeBusiness {
    retrieveCoupon: (couponId: string) => Promise<any>;
}

export default IStripeBusiness;
