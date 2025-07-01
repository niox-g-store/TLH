import Button from "../../../Common/HtmlTags/Button";

const AdminCoupon = (props) => {
    const { isLightMode } = props;

    return (
        <>
            <Button cls={`${isLightMode ? 'bg-white p-black': 'bg-black p-white'} align-self-end`} type={"third-btn"} text={"My Coupons"}/>
        </>
    )
}

export default AdminCoupon;
