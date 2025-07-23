import React, { useState } from "react";
import campaignTemplate from "./template";
import actions from '../../../../actions';
import { connect } from "react-redux";
import { ROLES } from "../../../../constants";
import Button from "../../../Common/HtmlTags/Button";
import Input from "../../../Common/HtmlTags/Input";
import Switch from "../../../store/Switch";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../../../withRouter";
import { GoBack } from "../../../../containers/goBack/inedx";

const ShowCampaignTemplate = (props) => {
  const { campaign } = props;
  const templateContent = campaignTemplate(
    campaign.title, campaign.shouldEmailContainUserName,
    campaign.content, campaign.imageUrls, campaign.event,
    campaign.user
  );

  return (
    <iframe
      title="Campaign Template Preview"
      style={{
        width: '100%',
        height: '500px',
        border: 'none'
      }}
      srcDoc={templateContent}
    />
  );
};


const CampaignViewer = (props) => {
    const {
        campaign,
        userRole,
        isLightMode,
        deleteCampaign,
        sendCampaign
    } = props;
    const navigate = useNavigate();
    const [registeredAttendees, setregisteredAttendees] = useState(false);
    const [newsletterSelected, setNewsletterSelected] = useState(false);
    const [unregisteredAttendees, setunregisteredAttendees] = useState(false);
    let disabled = true;
    if (userRole === ROLES.Admin) {
        if (newsletterSelected) { disabled = false }
        else if ( registeredAttendees || unregisteredAttendees ) { disabled = false }
    } else {
        if ( registeredAttendees || unregisteredAttendees ) { disabled = false }
    }

    const handleSubmit = (id, navigate,
                          newsletterSelected, registeredAttendees,
                          unregisteredAttendees, eventId) => {
        sendCampaign(id, navigate, newsletterSelected, registeredAttendees, unregisteredAttendees, eventId);
    };

    const handleUserSelection = (event) => {
        setregisteredAttendees(event);
    };

    const handleUnUserSelection = (event) => {
        setunregisteredAttendees(event);
    };

    const handleNewsletterSelection = (event) => {
        setNewsletterSelected(event);
    };

    return (
        <div className={`${isLightMode ? 'p-black' : 'p-white'} container-lg px-4 d-flex flex-column mb-custom-5em`}>
            <div
              style={{
                marginBottom: '0em',
                justifyContent: 'space-between',
                padding: '1em 1em'
              }}
              className='d-flex'
            >
              <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Viewing Campaign</h2>
              <GoBack navigate={navigate} />
            </div>
            <ShowCampaignTemplate campaign={campaign} />

            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', margin: '25px 0px' }}>
                {userRole === ROLES.Admin && !campaign.event &&
                  <>
                    <label htmlFor="send_to_newsletter">Send to newsletter subscribers</label>
                    <Switch
                        id="input-checkbox"
                        checked={newsletterSelected}
                        toggleCheckboxChange={handleNewsletterSelection}
                    />
                  </>
                }
            {campaign.event &&
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label htmlFor="send_to_users">Send to registered Attendees (users)</label>
                    <Switch
                        id="input-checkbox-user"
                        checked={registeredAttendees}
                        toggleCheckboxChange={handleUserSelection}
                    />
              </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label htmlFor="send_to_newsletter">Send to un-registered Attendees (Guest)</label>
          <Switch
            id="input-checkbox-guest"
            checked={unregisteredAttendees}
            toggleCheckboxChange={handleUnUserSelection}
          />
        </div>
        </>
        }
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '3em', justifyContent: 'center' }}>
        <div>
          <Button
            className={`primary-small ${disabled ? 'btn-disabled' : ''}`}
            text="Send"
            disabled={disabled}
            onClick={() => handleSubmit(
                campaign._id,
                navigate,
                newsletterSelected,
                registeredAttendees,
                unregisteredAttendees,
                campaign?.event
            )}
          />
        </div>

        <div>
          <Button
            className="last-small"
            text="Delete Campaign"
            onClick={() => deleteCampaign(campaign._id, navigate)}
          />
        </div>
      </div>
        </div>
    )
}

class CampaignView extends React.PureComponent {
    componentDidMount() {
        const campaignId = this.props.match.params.id;
        this.props.fetchCampaign(campaignId);
    }
    render () {
        return <CampaignViewer {...this.props} />
    }
}

const mapStateToProps = state => ({
  campaign: state.newsletter.newsletter,
  events: state.event.events,
  userRole: state.account.user.role,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(withRouter(CampaignView));
