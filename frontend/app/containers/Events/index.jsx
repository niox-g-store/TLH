import React from "react";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";

import EventsWrap from "../../components/store/EventsWrap/EventsWrap";
import actions from "../../actions";
import { withRouter } from "../../withRouter";
import { connect } from "react-redux";

const EventsView = (props) => {
  const { events } = props;
  return (
    <section className="events bg-white">
      <HeroBanner
        heading="Our Events"
        desc="Discover our events"
        bannerImage={[]}
      />

      <EventsWrap events={events}/>
    </section>
  );
};


class Events extends React.PureComponent {
  componentDidMount () {
    this.props.fetchAllEvents();
  }

  render () {
    return (
      <EventsView {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  events: state.event.allEvents,
  eventIsLoading: state.event.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(Events));
