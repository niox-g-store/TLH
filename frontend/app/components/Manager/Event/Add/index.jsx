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

const AddEvent = (props) => {
  const {
    eventFormData,
    eventFormErrors,
    eventChange,
    addEvent,
    eventIsLoading,
    isLightMode,
    image,
    eventCategories
  } = props;

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    addEvent(navigate);
  };

  return (
    <div className='add-event d-flex flex-column mb-custom-5em'>
      {eventIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div style={{ marginBottom: '-1em',
                    justifyContent: 'space-between',
                    padding: '0em 1em' }}
            className='d-flex'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Event details</h2>
        <GoBack navigate={navigate}/>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Event Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={eventFormErrors['name']}
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
              error={eventFormErrors['location']}
              label='Location'
              name='location'
              placeholder='Enter event location'
              value={eventFormData.location}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event Start Date */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={eventFormErrors['startDate']}
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
              error={eventFormErrors['endDate']}
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
              error={eventFormErrors['capacity']}
              label='Capacity'
              name='capacity'
              placeholder='Enter event capacity'
              value={eventFormData.capacity}
              onInputChange={eventChange}
            />
          </Col>

          {/* Event Category */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={eventFormErrors['category']}
              label='Category'
              placeholder='Enter category (e.g., Conference)'
              value={eventFormData.category}
              multi={false}
              options={eventCategories}
              handleSelectChange={(v) => eventChange('category', v)}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={eventFormErrors['description']}
              formData={eventFormData}
              placeholder={"Enter event description..."}
              isLightMode={isLightMode}
              onChange={eventChange}
            />
          </Col>

          {/* Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Input
              type='file'
              error={eventFormErrors['image']}
              name='image'
              label='Upload Event Image'
              placeholder='Please upload an image'
              value={image}
              onInputChange={(n, v) => eventChange(n, v)}
              //onFileChange={(file) => setImageFile(file)}
            />
          </Col>

          {/* Event Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-event'
              name='status'
              label='Is Active?'
              checked={eventFormData.isActive}
              toggleCheckboxChange={(value) =>
                eventChange('isActive', value)
              }
            />
          </Col>
        </Row>

        <hr className={`${isLightMode ? 'p-black' : 'p-white'}`}/>

        <Row>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Event Tickets</h2>
        </Row>

        <Row>
          <div className='add-event-actions'>
            <Button style={{ padding: '10px 20px' }} text='Add Event' />
          </div>
        </Row>
      </form>
    </div>
  );
};

export default AddEvent;
