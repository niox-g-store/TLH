/**
 *
 * Input
 *
 */

import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneNumberInput = ({ onPhoneChange, val }) => {
  const [value, setValue] = useState(val);

  const handleChange = (phoneNumber) => {
    setValue(phoneNumber);
    if (onPhoneChange) {
      onPhoneChange(phoneNumber);
    }
  };

  return (
    <div>
      <label htmlFor="phone-input" style={{ marginBottom: '10px', display: 'block' }}>
        Phone Number
      </label>
      <PhoneInput
        id="phone-input"
        placeholder="Enter phone number"
        defaultCountry="NG"
        value={value}
        onChange={handleChange}
        international
        countryCallingCodeEditable={true}
        className="phone-input"
        style={{ border: '1px solid #c9c9c9' }}
      />
    </div>
  );
};

const Input = props => {
  const {
    autoComplete = 'on',
    type,
    value,
    error,
    step = 1,
    decimals = true,
    min,
    max,
    disabled,
    placeholder,
    rows = 4,
    label,
    name,
    onInputChange,
    inlineElement = null,
    className,
    checked = false,
    onPhoneChange,
    val,
    multiple,
  } = props;

  const handleIncrement = () => {
    if (value < max) {
      onInputChange(name, value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onInputChange(name, value - 1);
    }
  };

  const newOnChange = e => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue >= min && newValue <= max) {
      onInputChange(name, newValue);
    }
  };

  const _onChange = e => {
    if (e.target.type === 'checkbox') {
      onInputChange(e.target.name, e.target.checked);
    } else if (e.target.name === 'image') {
      const files = Array.from(e.target.files);
      if (files) {
        onInputChange(e.target.name, files);
      } else {
        onInputChange(e.target.name, e.target.files[0])
      }
    } else {
      onInputChange(e.target.name, e.target.value);
    }
  };

  if (type === 'phone') {
    return (
      <>
      <PhoneNumberInput {...props}/>
      </>
    )
  } else if (type === 'textarea') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    return (
      <div className={styles}>
        {label && <label className="pp-black">{label}</label>}
        <textarea
          type={'textarea'}
          onChange={e => {
            _onChange(e);
          }}
          rows={rows}
          name={name}
          value={value}
          placeholder={placeholder}
          className={'textarea-text'}
        />
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else if (type === 'increment') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    return (
      <div className={styles} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '5px'}}>
        {label && <label className="pp-black">{label}</label>}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          style={{ padding: '5px 10px', marginRight: '5px', }}
        >
          -
        </button>
        <input
          type="number"
          min={min || 0}
          max={max || null}
          disabled={disabled}
          name={name}
          value={value}
          onChange={(e) => {
            newOnChange(e)
          }}
          style={{ textAlign: 'center', width: '60px' }}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          style={{ padding: '5px 10px', marginLeft: '5px', }}
        >
          +
        </button>
        </div>
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else if (type === 'number') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    const handleOnInput = e => {
      if (!decimals) {
        e.target.value = e.target.value.replace(/[^0-9]*/g, '');
      }
    };
    return (
      <div className={styles}>
        {label && <label style={{ marginBottom: '10px' }} className="pp-black">{label}</label>}
        <input
          autoComplete={autoComplete}
          step='step'
          min={min || 0}
          max={max || null}
          pattern='[0-9]'
          onInput={handleOnInput}
          type={type}
          onChange={e => {
            _onChange(e);
          }}
          disabled={disabled}
          name={name}
          value={value}
          placeholder={placeholder}
          className={'input-number'}
        />
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else if (type === "search") {
    return (
    <div className={`input-search ${className}`}>
        {label && <p style={{ marginBottom: '10px' }}>{label}</p>}
        <div className='input-text-block'>
          <input
            className={className && `${className} input-text` || 'input-text'}
            autoComplete={autoComplete}
            type={"text"}
            onChange={e => {
              _onChange(e);
            }}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
            checked={checked}
            style={{ fontFamily: 'sans-serif' }}
          />
          {inlineElement}
          <div className="input-search-icon"><IoIosSearch size={30}/> </div>
        </div>
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    )
  } else if (type === 'checkbox') {
    return (
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={e => {
            _onChange(e)
          }}
          style={{ position: 'relative', top: '-1px' }}
          disabled={disabled}
          className={className}
        />
        {label && <label className="pp-black" htmlFor={name}>{label}</label>}
      </div>
    )
  } else if (type === "file") {
    const styles = `input-box${inlineElement ? ` inline-btn-box` : ''} ${
      error ? 'invalid' : ''
    }`;

    return (
      <div className={styles}>
        {label && <p className='pp-black' style={{ marginBottom: '10px' }}>{label}</p>}
        <div className='input-text-block'>
          <input
            className={`${className && `${className} input-text` || 'input-text'}`}
            autoComplete={autoComplete}
            type={type}
            onChange={e => {
              _onChange(e);
            }}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
            checked={checked}
            multiple
          />
          {inlineElement}
        </div>
        <span className='invalid-message'>{error && error}</span>
      </div>
    );

  } else if (type === "submit") {
    const styles = `input-box${inlineElement ? ` inline-btn-box` : ''} ${
      error ? 'invalid' : ''
    }`;

    return (
      <div className={styles}>
        {label && <p className='pp-black' style={{ marginBottom: '10px' }}>{label}</p>}
        <div className='input-text-block'>
          <input
            className={`${className && `${className} input-text` || 'input-text'}`}
            autoComplete={autoComplete}
            type={type}
            onChange={e => {
              _onChange(e);
            }}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
            checked={checked}
          />
          {inlineElement}
        </div>
        <span className='invalid-message'>{error && error}</span>
      </div>
    );
  } else {
    const styles = `input-box${inlineElement ? ` inline-btn-box` : ''} ${
      error ? 'invalid' : ''
    }`;

    return (
      <div className={styles}>
        {label && <p className='pp-black' style={{ marginBottom: '10px' }}>{label}</p>}
        <div className='input-text-block'>
          <input
            className={`${className && `${className} input-text` || 'input-text'} p-black`}
            autoComplete={autoComplete}
            type={type === 'date' ? 'datetime-local' : type}
            onChange={e => {
              _onChange(e);
            }}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
            checked={checked}
          />
          {inlineElement}
        </div>
        <span className='invalid-message'>{error && error}</span>
      </div>
    );
  }
};
export default Input;