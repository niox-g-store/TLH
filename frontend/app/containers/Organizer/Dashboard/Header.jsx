import {
  CHeader,
  CContainer,
  CHeaderToggler,
  CAvatar,
  CFormSwitch
} from '@coreui/react';
import { CgMenuRightAlt } from 'react-icons/cg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useDispatch } from 'react-redux';

const HeaderPanel = (props) => {
  const { user, toggleMenu, isMenuOpen, toggleDashboardTheme, isLightMode } = props;

  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    const newMode = !isLightMode;
    localStorage.setItem('isLightMode', newMode);
    dispatch(toggleDashboardTheme(newMode));
    document.body.classList.toggle('light-mode', newMode);
    document.body.classList.toggle('dark-mode', !newMode);
  };

  // Use companyName or userName
  const source = user?.companyName || user?.userName || '';
  const initials = source
    .trim()
    .split(/\s+/)
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
<CHeader
  className={`mb-4 ${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'}`}
  position='sticky'
  style={{ height: '5em', borderBottom: 'none', paddingTop: '1.5em' }}
>
  <CContainer fluid className='d-flex justify-content-between align-items-center h-100'>
    <CHeaderToggler className='d-flex flex-row gap-4'>
      <CgMenuRightAlt className={isLightMode ? 'text-light-mode' : 'text-dark-mode'} size={30} onClick={toggleMenu} />
      <p className={`${isLightMode ? 'text-light-mode' : 'text-dark-mode'} padding-0 font-size-25`}>
        Welcome {source}
      </p>
    </CHeaderToggler>

    <div className='d-flex align-items-center'>
      <CFormSwitch
        label={isLightMode ? 'Light Mode' : 'Dark Mode'}
        id='themeToggleSwitch'
        className={`switch me-3 d-flex align-items-center gap-2 d-none d-lg-flex ${isLightMode ? 'text-light-mode' : 'text-dark-mode'}`}
        checked={isLightMode}
        onChange={handleThemeToggle}
      />
      <CAvatar className='linear-grad p-white' style={{
        fontWeight: 'bold',
        width: '2.2em',
        height: '2.2em',
        fontSize: '1.2em'
      }}>
        {initials}
      </CAvatar>
    </div>
  </CContainer>
</CHeader>

  );
};

export default HeaderPanel;
