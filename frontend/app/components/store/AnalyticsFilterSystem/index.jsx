import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from '../../store/Switch';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';

const FilterSystem = (props) => {
  const {
    onApplyFilter, isLightMode,
    isRangeSelection, startDate,
    endDate, singleDate,
    filterTarget,
    setIsRangeSelection,
  setStartDate,
  setEndDate,
  setSingleDate,
  setFilterTarget,
  resetDateSelection,
  } = props;

  const filterTargetOptions = ['Orders', 'Tickets', 'Income', 'Events'];

  const handleDateChange = (date) => {
    setSingleDate(date);
    if (isRangeSelection) {
      resetDateSelection();
    }
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (!isRangeSelection) {
      resetDateSelection();
    }
  };

  const handleApplyClick = () => {
    let effectiveStartDate = startDate;
    let effectiveEndDate = endDate;

    if (!isRangeSelection && singleDate) {
      effectiveStartDate = new Date(singleDate);
      effectiveStartDate.setHours(0, 0, 0, 0);

      effectiveEndDate = new Date(singleDate);
      effectiveEndDate.setHours(23, 59, 59, 999);
    }

    const filterCriteria = {
      target: filterTarget.toLowerCase(),
      isRange: isRangeSelection,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
    };
    onApplyFilter(filterCriteria);
  };

  const handleDownloadPdf = () => {
    console.log('Download PDF clicked');
  };

  const handleDownloadCsv = () => {
    console.log('Download CSV clicked');
  };

  return (
    <div
      data-aos="fade-right"
      className={`${isLightMode ? 'p-black' : 'p-white'} d-flex flex-wrap align-items-center gap-3 dashboard-controls`}
      style={{
        padding: '10px 10px',
        borderRadius: '10px',
      }}
    >

      <div style={{ flexShrink: 0 }}>
        <CDropdown>
          <CDropdownToggle color="light" size="lg" className="d-flex justify-content-between align-items-center">
            {filterTarget}
          </CDropdownToggle>
          <CDropdownMenu>
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

      <div style={{ flexShrink: 0 }}>
        <Switch
          id="date-range-toggle"
          checked={isRangeSelection}
          toggleCheckboxChange={() => {
            setIsRangeSelection(!isRangeSelection);
            resetDateSelection();
          }}
          label="Date Range"
        />
      </div>

      <div style={{ flexGrow: 0, minWidth: '180px' }}>
        {isRangeSelection ? (
          <DatePicker
            selected={startDate}
            onChange={handleRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showDisabledMonthNavigation
            placeholderText="Start - End Date"
            className="form-control w-100"
            popperPlacement="bottom-start"
          />
        ) : (
          <DatePicker
            selected={singleDate}
            onChange={handleDateChange}
            showDisabledMonthNavigation
            placeholderText="Select Date"
            className="form-control w-100"
            popperPlacement="bottom-start"
          />
        )}
      </div>


      <div style={{ flexShrink: 0 }}>
        <Button
          onClick={handleApplyClick}
          className="last-small p-black"
          text="Apply"
        />
      </div>

      <div className="d-flex align-items-center gap-2 attendees-data-container" style={{ marginLeft: 'auto', flexShrink: 0 }}>
        
        <span className="text-sm font-medium"></span>
        <button
          onClick={handleDownloadPdf}
          className="d-flex items-center justify-center p-2 rounded-md shadow-sm oone"
          style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', color: 'black', borderRadius: '10px' }}
        >
          <FiDownload size={16} /><FiFileText size={16} className="mr-1" /> PDF
        </button>
        <button
          onClick={handleDownloadCsv}
          className="d-flex items-center justify-center p-2 rounded-md shadow-sm ttwo"
          style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', color: 'black', borderRadius: '10px' }}
        >
          <FiDownload size={16} /><FiFile size={16} className="mr-1" /> CSV
        </button>
      </div>
    </div>
  );
};

export default FilterSystem;
