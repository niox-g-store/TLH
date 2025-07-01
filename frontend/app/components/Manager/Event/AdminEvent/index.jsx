import Button from "../../../Common/HtmlTags/Button";

const AdminEvent = (props) => {
    const { isLightMode } = props;

    return (
        <>
            <Button cls={`${isLightMode ? 'bg-white p-black': 'bg-black p-white'} align-self-end`} type={"third-btn"} text={"My Events"}/>
        </>
    )
}

export default AdminEvent;
