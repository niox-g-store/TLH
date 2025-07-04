import Button from "../../../Common/HtmlTags/Button";
import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from "../../../store/LoadingIndicator";
import { GoBack } from "../../../../containers/goBack/inedx";
import { useNavigate } from "react-router-dom";

const RenderDiscountInfo = ({ price, discountPrice, discount }) => {
  const priceNum = parseFloat(price);
  const discountPriceNum = parseFloat(discountPrice);

  if (discount && priceNum > 0 && discountPriceNum > 0 && discountPriceNum < priceNum) {
    const percent = ((priceNum - discountPriceNum) / priceNum) * 100;
    return (
      <span style={{ color: 'green', fontWeight: 'bold' }}>
        Buyers get {percent.toFixed(1)}% off!
      </span>
    );
  }

  return null;
};

const AddTicket = ({
  isLightMode,
  ticket,
  ticketChange,
  couponsOptions = [],
  ticketIsLoading
}) => {
    const navigate = useNavigate()
  return (
    <div className="add-ticket">
      {ticketIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
    <Row style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Ticket</h2>
      <GoBack navigate={navigate}/>
    </Row>

      <Row>
        {/* Ticket Type */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='text'
            label='Ticket Type'
            name='type'
            placeholder='e.g. VIP, General'
            value={ticket.type}
            onInputChange={(name, value) => onChange(name, value)}
          />
        </Col>

        {/* Price */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Price'
            name='price'
            placeholder='Enter ticket price'
            value={ticket.price}
            onInputChange={(name, value) => onChange(name, value)}
          />
        </Col>

        {/* Discount Switch */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12'>
          <Switch
            id='ticket-discount'
            name='discount'
            label='Has Discount?'
            checked={ticket.discount}
            toggleCheckboxChange={(value) => onChange('discount', value)}
          />
        </Col>

        {/* Discount Price + Percentage */}
        {ticket.discount && (
          <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
            <Input
              type='number'
              label='Discount Price'
              name='discountPrice'
              placeholder='Enter discounted price'
              value={ticket.discountPrice}
              onInputChange={(name, value) => onChange(name, value)}
            />
            <RenderDiscountInfo
              price={ticket.price}
              discountPrice={ticket.discountPrice}
              discount={ticket.discount}
            />
          </Col>
        )}

        {/* Coupons */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <SelectOption
            label='Apply Coupon(s)'
            placeholder='Select coupon(s)'
            value={ticket.coupons || []}
            options={couponsOptions}
            multi={true}
            handleSelectChange={(value) => onCouponSelect('coupons', value)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AddTicket;
