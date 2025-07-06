/**
 *
 * AddEventView
 *
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';

import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import DescriptionBox from '../../../store/DescriptionBox';
import SelectOption from '../../../store/SelectOption';
import { GoBack } from '../../../../containers/goBack/inedx';
import AddEventTicket from './ticket';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { connect } from 'react-redux';
import { withRouter } from '../../../../withRouter';
import actions from "../../../../actions";

const AddEventForm = (props) => {
  const {
    eventFormData,
    eventFormErrors,
    eventChange,
    addEvent,
    eventIsLoading,
    isLightMode,
    image,
    eventCategories,
    eventTickets,
    couponsOptions
  } = props;

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    addEvent(navigate);
  };

  const isFormComplete = () => {
    const requiredFields = ['name', 'location', 'startDate', 'endDate', 'category', 'description', 'image'];
    return requiredFields.every(field => eventFormData[field] && eventFormData[field].toString().trim() !== '');
  };


  return (
    <div className='add-event d-flex flex-column mb-custom-5em'>
      {eventIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Event</h2>
        <GoBack navigate={navigate} />
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Event Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={eventFormErrors.name}
              label='Event Name'
              name='name'
              placeholder='Enter event name'
              value={eventFormData.name}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event Location */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={eventFormErrors.location}
              label='Venue'
              name='location'
              placeholder='Enter event Venue'
              value={eventFormData.location}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event Start Date */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={eventFormErrors.startDate}
              label='Start Date'
              name='startDate'
              value={eventFormData.startDate}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event End Date */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={eventFormErrors.endDate}
              label='End Date'
              name='endDate'
              value={eventFormData.endDate}
              onInputChange={eventChange}
            />
          </Col>

          {/* Capacity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={eventFormErrors.capacity}
              label='Capacity'
              name='capacity'
              placeholder='Enter no. of attendees (Optional)'
              value={eventFormData.capacity}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event Category */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={eventFormErrors.category}
              label='Category'
              placeholder='Select category (e.g., Conference)'
              value={eventFormData.category}
              multi={false}
              options={eventCategories}
              handleSelectChange={(v) => eventChange('category', v)}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={eventFormErrors.description}
              formData={eventFormData}
              placeholder='Enter event description...'
              isLightMode={isLightMode}
              onChange={eventChange}
            />
          </Col>

          {/* Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
          <AdvancedUpload
            error={eventFormErrors.image}
            onFilesChange={(files) => eventChange('image', files)} />
            {/*<Input
              type='file'
              error={eventFormErrors.image}
              name='image'
              label='Upload Event Image'
              placeholder='Please upload an image'
              value={image}
              onInputChange={(n, v) => eventChange(n, v)}
            />*/}
          </Col>

          {/* Event Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-event'
              name='status'
              label='Is Active?'
              checked={eventFormData.isActive}
              toggleCheckboxChange={(value) =>
                eventChange('isActive', value)}
            />
          </Col>
        </Row>

        <Row>
          <div className='add-event-actions'>
            <div className="alert alert-info" role="alert">
              Please complete all event details before proceeding. Once the form is fully filled out,
              you’ll be able to add one or more tickets during the event creation process.
              <br />
              <br />
              Alternatively, you can choose to save the event without adding any ticket for now.
            </div>
            <Button style={{ padding: '10px 20px' }} text='Save Event' />
          </div>
        </Row>

        <Row>
        {!isFormComplete() && (
          <div className="text-muted mt-4 alert alert-info" role='alert'>
            <em>Fill out all event details above to add tickets.</em>
          </div>
        )}
        </Row>

        {isFormComplete() && (
          <>
            <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />
            <AddEventTicket {...props} />
          </>
        )}
      </form>
    </div>
  );
};


class AddEvent extends React.PureComponent {
  componentDidMount () {
    this.props.fetchCouponsSelect();
  }

  render () {
    const {
      eventFormData,
      eventFormErrors,
      eventChange,
      addEvent,
      eventIsLoading,
      isLightMode,
      image,
      eventCategories,
      eventTickets,
      couponsOptions
    } = this.props;
    return (
      <AddEventForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  eventFormData: state.event.eventFormData,
  eventFormErrors: state.event.formErrors,
  eventIsLoading: state.event.isLoading,
  isLightMode: state.dashboard.isLightMode,
  eventCategories: state.event.eventCategories,
  eventIsLoading: state.event.isLoading,
  couponsOptions: state.coupon.couponsSelect
});

export default connect(mapStateToProps, actions)(withRouter(AddEvent));
