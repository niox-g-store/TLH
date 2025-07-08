import React from "react";
import GalleryWrapper from "../../components/store/GalleryWrapper";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import actions from "../../actions";
import { withRouter } from "../../withRouter";
import { connect } from "react-redux";
import LoadingIndicator from "../../components/store/LoadingIndicator";
import { API_URL } from "../../constants";

class Gallery extends React.PureComponent {
  componentDidMount () {
    this.props.fetchGalleries();
  }

  render () {
    const { galleryIsLoading, galleries } = this.props;
    const firstImage = galleries &&
      galleries.length > 0 && API_URL + galleries[0].bannerUrl || './assets/gallery/g_3.JPG';
    return (
      <>
        {galleryIsLoading && <LoadingIndicator />}
        <section className="gallery-page bg-white">
            <HeroBanner
                heading="The link hangouts gallery"
                desc="PARTY ENTERTAINMENT SERVICE"
                bannerImage={[]}
                heroBannerBg={firstImage}
            />
            <GalleryWrapper galleries={galleries} />
        </section>
      </>
    );
  }
}

const mapStateToProps = state => ({
  galleries: state.gallery.galleries,
  galleryIsLoading: state.gallery.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(Gallery));
