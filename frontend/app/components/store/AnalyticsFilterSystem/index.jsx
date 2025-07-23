import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from '../../store/Switch'; // Assuming this is your custom Switch component
import {
  CButton, // Using CButton for the Apply button
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck // For radio buttons if preferred, but CDropdownItem is simpler here
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';

const FilterSystem = ({ onApplyFilter, isLightMode }) => {
  // Date selection states
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [singleDate, setSingleDate] = useState(null);

  // Filter target state
  const [filterTarget, setFilterTarget] = useState('orders'); // Default to 'orders'
  const filterTargetOptions = ['Orders', 'Tickets', 'Income', 'Events'];

  const handleDateChange = (date) => {
    setSingleDate(date);
    // Clear range dates if switching to single
    if (isRangeSelection) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    // Clear single date if switching to range
    if (!isRangeSelection) {
      setSingleDate(null);
    }
  };

  const handleApplyClick = () => {
    const filterCriteria = {
      target: filterTarget.toLowerCase(), // Ensure consistent lowercase for backend
      isRange: isRangeSelection,
      startDate: isRangeSelection ? startDate : singleDate,
      endDate: isRangeSelection ? endDate : singleDate, // For single date, end date is the same as start date
    };
    onApplyFilter(filterCriteria);
  };

  // Determine if the Apply button should be disabled
  const isApplyDisabled = isRangeSelection
    ? !startDate || !endDate
    : !singleDate || !filterTarget;

  return (
    <div
      className={`${isLightMode ? 'p-black' : 'p-white'}`}
      style={{
        padding: ' 10px 15px',
        borderRadius: '10px',
        width: '100%',
        margin: '20px auto',
        display: 'flex',
      }}
    >
        <h3>Dashboard controls</h3>
      <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>Apply Filters</h4>

      {/* Filter Target Selection */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Apply filter to:
        </label>
        <CDropdown className="w-100">
          <CDropdownToggle color="light" className="w-100 d-flex justify-content-between align-items-center">
            {filterTarget}
          </CDropdownToggle>
          <CDropdownMenu className="w-100">
            {filterTargetOptions.map((option) => (
              <CDropdownItem
                key={option}
                onClick={() => setFilterTarget(option)}
                active={filterTarget === option}
              >
                {option}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
      </div>

      {/* Date Range Toggle */}
      <div style={{ marginBottom: '25px' }}>
        <Switch
          id="date-range-toggle"
          checked={isRangeSelection}
          toggleCheckboxChange={() => {
            setIsRangeSelection(!isRangeSelection);
            // Clear dates when toggling selection type
            setStartDate(null);
            setEndDate(null);
            setSingleDate(null);
          }}
          label="Enable Date Range Selection"
        />
      </div>

      {/* Date Pickers */}
      <div style={{ marginBottom: '30px' }}>
        {isRangeSelection ? (
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Select Date Range:
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleRangeChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              showDisabledMonthNavigation
              placeholderText="Start Date - End Date"
              className="form-control w-100" // Ensure it takes full width
              popperPlacement="bottom-start"
            />
            {startDate && endDate && (
              <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
                Selected Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Select Single Date:
            </label>
            <DatePicker
              selected={singleDate}
              onChange={handleDateChange}
              showDisabledMonthNavigation
              placeholderText="Select a date"
              className="form-control w-100" // Ensure it takes full width
              popperPlacement="bottom-start"
            />
            {singleDate && (
              <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
                Selected Date: {singleDate.toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <div style={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
        <Button
          onClick={handleApplyClick}
          disabled={isApplyDisabled}
          className="last-small p-black"
          text={"Apply Filter"}
        >
        </Button>
      </div>
    </div>
  );
};

export default FilterSystem;
