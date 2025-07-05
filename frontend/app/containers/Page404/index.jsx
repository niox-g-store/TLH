import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import PButton from "../../components/Common/HtmlTags/PrimaryButton/PButton";
import SButton from "../../components/Common/HtmlTags/SecondaryButton/SButton";

const Page404 = (props) => {
    const { text = "Oops Page doesn't exist" } = props;
    return (
        <div className="page-404">
            <HeroBanner
                heading={text}
                desc="Meanwhile you can see other links below"
                bannerImage={[]}
                PButton={<PButton link={"/events"} content="Discover Events" />}
                SButton={<SButton link={"/gallery"} content="See Gallery" />}
                className={"border-10"}
        />
        </div>
    )
}

export default Page404;
