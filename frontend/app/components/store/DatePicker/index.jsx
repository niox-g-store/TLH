import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from '../../store/Switch';

function DateRangeAndSinglePicker() {
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [singleDate, setSingleDate] = useState(null);

  const handleDateChange = (date) => {
    setSingleDate(date);
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
      <div style={{ marginBottom: '20px' }}>
          <Switch
            id="date-range-picker"
            checked={isRangeSelection}
            toggleCheckboxChange={() => setIsRangeSelection(!isRangeSelection)}
            label={"Enable Date Range Selection"}
          />
      </div>

      {isRangeSelection ? (
        <div>
          <p>Select Date Range</p>
          <DatePicker
            selected={startDate}
            onChange={handleRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showDisabledMonthNavigation
            placeholderText="Select a date range"
            className="form-control"
          />
          {startDate && endDate && (
            <p style={{ marginTop: '10px' }}>
              Selected Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p>Select Single Date</p>
          <DatePicker
            selected={singleDate}
            onChange={handleDateChange}
            showDisabledMonthNavigation
            placeholderText="Select a single date"
            className="form-control"
          />
          {singleDate && (
            <p style={{ marginTop: '10px' }}>
              Selected Date: {singleDate.toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DateRangeAndSinglePicker;