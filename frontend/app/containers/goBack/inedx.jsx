import Button from "../../components/Common/HtmlTags/Button"

export const GoBack = ({navigate}) => {
    return (
        <>
        <Button onClick={() => navigate(-1)} type={"third-btn"} text={"Cancel"}/>
        </>
    )
}