/**
 *
 * AddEventTicket
 *
 */

import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';

import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';

const AddEventTicket = (props) => {
  const {
    ticketFormData,
    ticketFormErrors,
    ticketChange,
    addTicket,
    isLightMode,
  } = props;

  const getDiscountPercentage = () => {
    const price = parseFloat(ticketFormData.price);
    const discountPrice = parseFloat(ticketFormData.discountPrice);

    if (
      ticketFormData.discount &&
      price > 0 &&
      discountPrice > 0 &&
      discountPrice < price
    ) {
      const percent = ((price - discountPrice) / price) * 100;
      return `Buyers get ${percent.toFixed(1)}% off!`;
    }
    return null;
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    addTicket(navigate);
  };

  return (
    <div className="add-event-ticket d-flex flex-column mb-custom-5em">
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em',
        }}
        className="d-flex"
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>
          Event Tickets
        </h2>
      </div>

        <Row>
          {/* Ticket Type */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs="12" lg="6">
            <Input
              type="text"
              error={ticketFormErrors['type']}
              label="Ticket Type"
              name="type"
              placeholder="e.g. VIP, General"
              value={ticketFormData.type}
              onInputChange={ticketChange}
            />
          </Col>

          {/* Price */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs="12" lg="6">
            <Input
              type="number"
              error={ticketFormErrors['price']}
              label="Price"
              name="price"
              placeholder="Enter ticket price"
              value={ticketFormData.price}
              onInputChange={ticketChange}
            />
          </Col>

          {/* Discount Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs="12">
            <Switch
              id="discount"
              name="discount"
              label="Has Discount?"
              checked={ticketFormData.discount}
              toggleCheckboxChange={(value) =>
                ticketChange('discount', value)
              }
            />
          </Col>

          {/* Discount Price (only shown if discount is true) */}
          {ticketFormData.discount && (
  <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs="12" lg="6">
    <Input
      type="number"
      error={ticketFormErrors['discountPrice']}
      label="Discount Price"
      name="discountPrice"
      placeholder="Enter discounted price"
      value={ticketFormData.discountPrice}
      onInputChange={ticketChange}
    />

    {/* Show discount percentage */}
    {getDiscountPercentage() && (
      <p
        style={{
          marginTop: '0.5em',
          color: 'green',
          fontWeight: 'bold',
        }}
      >
        {getDiscountPercentage()}
      </p>
    )}
  </Col>
          )}
        </Row>

        <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

        <Row>
          <div className="add-event-actions">
            <Button style={{ padding: '10px 20px' }} text="Add Ticket" />
          </div>
        </Row>
    </div>
  );
};

export default AddEventTicket;
