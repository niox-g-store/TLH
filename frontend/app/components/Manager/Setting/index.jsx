import React from 'react';
import Switch from '../../store/Switch';
import actions from '../../../actions';
import { connect } from 'react-redux';
import LoadingIndicator from '../../store/LoadingIndicator';
import SelectOption from '../../store/SelectOption';

const SettingForm = (props) => {
  const { updateSettings, settings, isLoading, isLightMode, } = props;

  const handleToggleMaintenance = (e) => {
    updateSettings({ ...settings, maintenance: !settings.maintenance });
  };

  const handleCommissionChange = (e) => {
    updateSettings({ ...settings, commission: e.target.value });
  };
  const handleIslandDeliveryFeeChange = (e) => {
    updateSettings({ ...settings, islandDeliveryFee: e.target.value });
  };
  const handleMainlandDeliveryFeeChange = (e) => {
    updateSettings({ ...settings, mainlandDeliveryFee: e.target.value });
  };

  const handleEarningControlChange = (option) => {
    updateSettings({ ...settings, earningControl: option.value });
  };

  const handleFixedDaysChange = (selectedOptions) => {
    updateSettings({ ...settings, fixedDays: selectedOptions.map(option => option.value) });
  };

  const handleHoursChange = (option) => {
    updateSettings({ ...settings, hours: option.value });
  };

  const daysOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  const hoursOptions = [
    { value: 24, label: '24 Hours' },
    { value: 48, label: '48 Hours' },
    { value: 72, label: '72 Hours' },
    { value: 96, label: '96 Hours' }
  ];

  return (
    <div className={`container-lg px-4 d-flex flex-column mb-custom-5em`}>
      {isLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div className='d-flex justify-content-between'>
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'}`}>Settings</h2>
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />

      <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
        <label className='me-2'>Maintenance Mode</label>
        <Switch
          id="maintenance-toggle"
          checked={settings.maintenance}
          toggleCheckboxChange={handleToggleMaintenance} />
      </div>
      <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
        <label className='me-2'>Commission (%)</label>
        <input type="number" value={settings.commission || ''} onChange={handleCommissionChange} className={`${isLightMode ? 'input-light' : 'input-dark'}`} />
      </div>
      <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
        <label className='me-2'>Earning Control</label>
        <SelectOption
          defaultValue={
            settings.earningControl
              ? { value: settings.earningControl, label: settings.earningControl === 'fixed' ? 'Fixed Days' : 'Hours' }
              : null
          }
          value={
            settings.earningControl
              ? { value: settings.earningControl, label: settings.earningControl === 'fixed' ? 'Fixed Days' : 'Hours' }
              : null
          }
          handleSelectChange={(n) => {
            handleEarningControlChange(n)
          }}
          options={[
            { value: 'fixed', label: 'Fixed Days' },
            { value: 'hours', label: 'Hours' }
          ]}
          className={`${isLightMode ? 'p-white' : 'bg-white p-black'}`}
        />
      </div>
      {settings.earningControl === 'fixed' && (
        <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <label className='me-2'>Fixed Days</label>
          <SelectOption
            multi={true}
            defaultValue={(settings.fixedDays || []).map(day => ({ value: day, label: day }))}
            value={(settings.fixedDays || []).map(day => ({ value: day, label: day }))}
            handleSelectChange={(n) => handleFixedDaysChange(n)}
            options={daysOptions}
            className={`${isLightMode ? 'p-white' : 'bg-white p-black'}`}
          />
        </div>
      )}
      {settings.earningControl === 'hours' && (
        <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
          <label className='me-2'>Hours</label>
          <SelectOption
            defaultValue={
                settings.hours
                ? { value: settings.hours, label: `${settings.hours} Hours` }
                : hoursOptions[0]
            }
            value={
              settings.hours
                ? { value: settings.hours, label: `${settings.hours} Hours` }
                : hoursOptions[0]
            }
            handleSelectChange={(n) => handleHoursChange(n)}
            options={hoursOptions}
            className={`${isLightMode ? 'p-white' : 'bg-white p-black'}`}
          />
        </div>
      )}
      <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
        <label className='me-2 mb-2'>Mainland Delivery Fee</label>
        <input
          type="number" value={settings.mainlandDeliveryFee || ''}
          placeholder='Enter Mainland Delivery Fee'
          onChange={handleMainlandDeliveryFeeChange}
          className={`${isLightMode ? 'input-light' : 'input-dark'}`}
        />
      </div>

      <div className={`mb-3 ${isLightMode ? 'p-black' : 'p-white'}`}>
        <label className='me-2 mb-2'>Island Delivery Fee</label>
        <input
          type="number" value={settings.islandDeliveryFee || ''}
          placeholder='Enter Island Delivery Fee'
          onChange={handleIslandDeliveryFeeChange}
          className={`${isLightMode ? 'input-light' : 'input-dark'}`}
        />
      </div>
    </div>
  );
};

class Setting extends React.PureComponent {
    componentDidMount () {
        this.props.fetchSettings();
    }
    render () {
        return (
            <SettingForm {...this.props} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        settings: state.setting.settings,
        isLoading: state.setting.isLoading,
        isLightMode: state.dashboard.isLightMode
    }
}

export default connect(mapStateToProps, actions)(Setting);