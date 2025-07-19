// src/containers/Gallery/GalleryViewer.js
import React from 'react';
import { withRouter } from '../../withRouter';
import actions from '../../actions';
import { connect } from 'react-redux';
import FadeSlider from '../../components/store/FadeSlider';
import { API_URL } from '../../constants';
import { formatReadableDate } from '../../components/store/Card/functions';
import Page404 from '../Page404';
import LoadingIndicator from '../../components/store/LoadingIndicator';
import GalleryViewer from '../../components/store/GalleryViewer';


class GalleryView extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    if (slug) {
      this.props.fetchGallerySlug(slug);
    }
  }

  componentWillUnmount() {
    this.props.resetGallerySlugChange();
  }
  render () {
  const { gallery = {}, galleryIsLoading, gallerySlugChange } = this.props;
  const isGallerySelected = Object.keys(gallery).length > 0;

  if (galleryIsLoading && !isGallerySelected) {
    return <LoadingIndicator />;
  }

  if (gallerySlugChange) {
    return (
      <Page404 text={"Oops, the gallery you're looking for has changed or does not exist."}/>
    );
  }

  return (
    <div className="gallery-view bg-white">
      <div className='view-gallery'>
        <GalleryViewer gallery={gallery && gallery}/>
      </div>
    </div>
  );
}
};


const mapStateToProps = state => ({
  gallery: state.gallery.selectGallery,
  galleryIsLoading: state.gallery.isLoading,
  gallerySlugChange: state.gallery.gallerySlugChange
});

export default connect(mapStateToProps, actions)(withRouter(GalleryView));