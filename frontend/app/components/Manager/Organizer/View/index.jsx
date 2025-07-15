// OrganizerView.jsx
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import actions from '../../../actions';
import { CCard, CCardBody, CCardTitle, CCardText, CBadge, CButton } from '@coreui/react';
import { Link } from 'react-router-dom';

const OrganizerView = ({ fetchOrganizerById, organizer, suspendOrganizer, resumeOrganizer, deleteOrganizer, isLightMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizerById(id);
  }, [id, fetchOrganizerById]);

  const handleSuspend = () => suspendOrganizer(id);
  const handleResume = () => resumeOrganizer(id);
  const handleDelete = () => {
    deleteOrganizer(id);
    navigate('/dashboard/organizers');
  };

  if (!organizer) return <p>Loading...</p>;

  return (
    <div className="container-lg px-4">
      <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>{organizer.companyName}</h2>
      <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
        <CCardBody>
          <CCardTitle>Email: {organizer.email}</CCardTitle>
          <CCardText>Phone: {organizer.phoneNumber || 'N/A'}</CCardText>
          <CBadge color={organizer.isActive ? 'success' : 'danger'}>
            {organizer.isActive ? 'Active' : 'Suspended'}
          </CBadge>
          <div className='mt-3'>
            <CButton color='warning' className='me-2' onClick={handleSuspend} disabled={!organizer.isActive}>Suspend</CButton>
            <CButton color='success' className='me-2' onClick={handleResume} disabled={organizer.isActive}>Resume</CButton>
            <CButton color='danger' onClick={handleDelete}>Delete</CButton>
          </div>
          <hr />
          <h5>Events Created:</h5>
          <ul>
            {organizer.event.map(ev => (
              <li key={ev._id}><Link to={`/dashboard/events/edit/${ev.slug}`}>{ev.slug}</Link></li>
            ))}
          </ul>
        </CCardBody>
      </CCard>
    </div>
  );
};

const mapState = state => ({
  organizer: state.organizer.selectedOrganizer,
  isLightMode: state.dashboard.isLightMode
});

export default connect(mapState, actions)(OrganizerView);
