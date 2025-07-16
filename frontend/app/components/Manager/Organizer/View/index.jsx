// OrganizerView.jsx
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import actions from '../../../../actions';
import { withRouter } from '../../../../withRouter';
import { CCard, CCardBody, CCardTitle, CCardText, CBadge, CButton, CImage } from '@coreui/react';
import LoadingIndicator from '../../../store/LoadingIndicator';
import Button from '../../../Common/HtmlTags/Button';
import { formatDate } from '../../../../utils/formatDate';
import ResolveImage from '../../../store/ResolveImage';
import { API_URL } from '../../../../constants';
import { GoBack } from '../../../../containers/goBack/inedx';

const OrganizerViewer = (props) => {
  const {
    organizer, suspendOrganizer,
    resumeOrganizer, deleteOrganizer,
    isLightMode, isLoading,
    unbanOrganizer
  } = props;
  const navigate = useNavigate();
  const id = organizer._id;

  const handleSuspend = () => suspendOrganizer(id);
  const handleResume = () => resumeOrganizer(id);
  const handleDelete = () => deleteOrganizer(id, navigate);
  const handleUnBanned = () => unbanOrganizer(id, navigate);

  return (
    <div className='container-lg px-4 d-flex flex-column'>
      <div style={{ alignSelf: 'end' }} >
        <GoBack navigate={navigate} />
      </div>
      {isLoading && <LoadingIndicator />}
      <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>{organizer?.companyName}</h2>
<CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
  <CCardBody>
    {/* Profile Image */}
    {organizer?.user?.imageUrl && (
      <div className='mb-3 text-center'>
        <CImage
          src={ResolveImage(API_URL + organizer.user.imageUrl, 'profile')}
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>
    )}

    <CCardTitle>Email: {organizer?.email}</CCardTitle>
    <CCardText>Phone: {organizer?.phoneNumber || 'N/A'}</CCardText>

    {/* Social and Bio Details */}
    {organizer?.user && (
      <>
        {organizer.user.bio && (
          <CCardText><strong>Bio:</strong> {organizer.user.bio}</CCardText>
        )}
        {organizer.user.contactEmail && (
          <CCardText><strong>Contact Email:</strong> {organizer.user.contactEmail}</CCardText>
        )}
        {organizer.user.instagram && (
          <CCardText><strong>Instagram:</strong> {organizer.user.instagram}</CCardText>
        )}
        {organizer.user.tiktok && (
          <CCardText><strong>TikTok:</strong> {organizer.user.tiktok}</CCardText>
        )}
        {organizer.user.facebook && (
          <CCardText><strong>Facebook:</strong> {organizer.user.facebook}</CCardText>
        )}
      </>
    )}

          
          <CBadge color={organizer.isActive ? 'success' : 'danger'}>
            {organizer.isActive ? 'Active' : 'Suspended'}
          </CBadge>
          <br />
          <br />
          <CBadge color={organizer.banned ? 'danger' : 'success'}>
                  {organizer.banned ? 'Banned' : 'Not Banned'}
          </CBadge>
          <div className='mt-3'>
            <CButton color='warning' className='me-2' onClick={handleSuspend} disabled={!organizer?.isActive}>Suspend</CButton>
            <CButton color='success' className='me-2' onClick={handleResume} disabled={organizer?.isActive}>Resume</CButton>
            <CButton className='me-2' color='danger' disabled={organizer?.banned} onClick={handleDelete}>Ban</CButton>
            <CButton className='me-2' color='secondary' disabled={!organizer?.banned} onClick={handleUnBanned}>Remove ban</CButton>
          </div>
          <hr />
          <h5>Events Created:</h5>

          {organizer?.event?.length > 0
            ? (
              <div className='row g-4'>
                {organizer.event.map((ev) => (
                  <div key={ev._id} className='col-md-6'>
                    <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
                      <div className='d-flex admin-view-organizer'>
                        <CImage
                          src={ResolveImage(API_URL + (ev.imageUrls?.[0] || ''))}
                          alt={ev.name}
                          style={{ width: '40%', objectFit: 'cover', height: '100%' }}
                        />
                        <CCardBody className='flex-grow-1'>
                          <CCardTitle className='fw-bold'>{ev.name}</CCardTitle>
                          <div className='d-flex'>
                            <CCardText as={'div'}>
                              <strong>Created:</strong> {formatDate(ev.createdAt)}<br />
                              <strong>Start:</strong> {formatDate(ev.startDate)}<br />
                              <strong>End:</strong> {formatDate(ev.endDate)}<br />
                              <strong>Status:</strong> {ev.status}<br />
                              <strong>Tickets Sold:</strong> {ev.attendees || 0}<br />
                              <strong>Category:</strong> {ev.category}<br />
                              <strong>Visibility:</strong> {ev.visibility ? 'Public' : 'Private'}<br />
                              <strong>Tickets:</strong> {ev.tickets?.length || 0}
                              <Button
                                style={{ padding: '5px 10px', fontSize: '12px', marginTop: '.5em' }}
                                text='Edit Event'
                                onClick={() => navigate(`/dashboard/events/edit/${ev._id}`)}
                            />
                            </CCardText>
                          </div>
                        </CCardBody>
                      </div>
                    </CCard>
                  </div>
                ))}
              </div>
              )
            : (
              <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>No events created by this organizer.</p>
              )}
        </CCardBody>
      </CCard>
    </div>
  );
};

class OrganizerView extends React.PureComponent {
  componentDidMount () {
    this.props.resetOrganizer();
    const id = this.props.match.params.id;
    this.props.fetchOrganizerById(id);
  }

  componentDidUpdate (prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetOrganizer();
      const id = this.props.match.params.id;
      this.props.fetchOrganizerById(id);
    }
  }

  render () {
    return (
      <OrganizerViewer {...this.props} />
    );
  }
}

const mapState = state => ({
  organizer: state.organizer.selectedOrganizer,
  isLightMode: state.dashboard.isLightMode,
  isLoading: state.organizer.loading
});

export default connect(mapState, actions)(withRouter(OrganizerView));
