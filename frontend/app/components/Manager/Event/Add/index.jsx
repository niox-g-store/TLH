/**
 *
 * AddEventView
 *
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import DescriptionBox from '../../../store/DescriptionBox';
import SelectOption from '../../../store/SelectOption';

const place = "Enter event description...";

const AddEvent = props => {
  const {
    productFormData,
    formErrors,
    productChange,
    addProduct,
    isLoading,
    isLightMode,
    image
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addProduct();
  };

  return (
    <div className='add-event'>
      {isLoading && <LoadingIndicator isLightMode={isLightMode} />}

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Event Name */}
          <Col xs='12' lg='6'>
            <Input
              type='text'
              error={formErrors['name']}
              label='Event Name'
              name='name'
              placeholder='Enter event name'
              value={productFormData.name}
              onInputChange={productChange}
            />
          </Col>

          {/* Event Location */}
          <Col xs='12' lg='6'>
            <Input
              type='text'
              error={formErrors['location']}
              label='Location'
              name='location'
              placeholder='Enter event location'
              value={productFormData.location}
              onInputChange={productChange}
            />
          </Col>

          {/* Event Start Date */}
          <Col xs='12' lg='6'>
            <Input
              type='date'
              error={formErrors['startDate']}
              label='Start Date'
              name='startDate'
              value={productFormData.startDate}
              onInputChange={productChange}
            />
          </Col>

          {/* Event End Date */}
          <Col xs='12' lg='6'>
            <Input
              type='date'
              error={formErrors['endDate']}
              label='End Date'
              name='endDate'
              value={productFormData.endDate}
              onInputChange={productChange}
            />
          </Col>

          {/* Capacity */}
          <Col xs='12' lg='6'>
            <Input
              type='number'
              error={formErrors['capacity']}
              label='Capacity'
              name='capacity'
              placeholder='Enter event capacity'
              value={productFormData.capacity}
              onInputChange={productChange}
            />
          </Col>

          {/* Event Category */}
          <Col xs='12' lg='6'>
            <Input
              type='text'
              error={formErrors['category']}
              label='Category'
              name='category'
              placeholder='Enter category (e.g., Conference)'
              value={productFormData.category}
              onInputChange={productChange}
            />
          </Col>

          {/* Description */}
          <Col xs='12'>
            <DescriptionBox
              error={formErrors['description']}
              productChange={productChange}
              productFormData={productFormData}
              placeholder={place}
            />
          </Col>

          {/* Image Upload */}
          <Col xs='12'>
            <Input
              type='file'
              error={formErrors['image']}
              name='image'
              label='Upload Event Image'
              placeholder='Please upload an image'
              value={image}
              onInputChange={productChange}
            />
          </Col>

          {/* Event Status Switch */}
          <Col xs='12' className='my-2'>
            <Switch
              id='active-event'
              name='status'
              label='Is Active?'
              checked={productFormData.status === 'Upcoming'}
              toggleCheckboxChange={value =>
                productChange('status', value ? 'Upcoming' : 'Cancelled')
              }
            />
          </Col>
        </Row>

        <hr />

        <div className='add-event-actions'>
          <Button type='submit' text='Add Event' />
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
