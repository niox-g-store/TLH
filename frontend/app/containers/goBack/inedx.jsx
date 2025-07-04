import Button from "../../components/Common/HtmlTags/Button"

export const GoBack = (props) => {
    const { navigate, text = "Cancel" } = props;
    return (
        <>
        <Button onClick={() => navigate(-1)} type={"third-btn"} text={text}/>
        </>
    )
}