import React from "react";
import Button from "../../../Common/HtmlTags/Button";
import { ManagerTicketHelper } from "..";
import { connect } from "react-redux";
import { withRouter } from "../../../../withRouter";
import actions from "../../../../actions";


class AdminTicket extends React.PureComponent {
    componentDidMount() {
        this.props.getUserTicket();
    }
    render () {
        const { isLightMode } = this.props;
        return (
            <>
                <ManagerTicketHelper adminGoBack={true} {...this.props}/>
            </>
        )
    }
}

const mapStateToProps = state => ({
  ticketIsLoading: state.ticket.isLoading,
  tickets: state.ticket.userTicket,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(withRouter(AdminTicket));
