import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import PButton from "../../components/Common/HtmlTags/PrimaryButton/PButton";
import SButton from "../../components/Common/HtmlTags/SecondaryButton/SButton";

const Page404 = () => {
    const image404 = "assets/events/event_7.jpeg"
    return (
        <div className="page-404">
            <HeroBanner
                heading="Oops Page doesn't exist"
                desc="Meanwhile you can see other links below"
                bannerImage={[image404]}
                PButton={<PButton link={"/events"} content="Discover Events" />}
                SButton={<SButton link={"/gallery"} content="See Gallery" />}
                className={"border-10"}
        />
        </div>
    )
}

export default Page404;
