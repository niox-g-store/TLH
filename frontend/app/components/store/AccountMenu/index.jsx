import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CFormSwitch
} from '@coreui/react'
import { Link } from 'react-router-dom'
import {
  IoTicketOutline, IoBasketOutline,
  IoScanOutline, IoCloseOutline,
  IoReceiptOutline
} from "react-icons/io5";
import {
  MdOutlineEventRepeat, MdOutlineAccountCircle,
  MdOutlineSecurity, MdOutlineCampaign,
  MdOutlinePersonSearch, MdOutlinePhotoLibrary,
  MdOutlinePermMedia, MdOutlinePeople,
  MdOutlineGroups2, MdOutlinePayment } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { AiOutlineShop } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { TbPigMoney } from "react-icons/tb";

const iconMap = {
  IoTicketOutline,
  MdOutlineEventRepeat,
  IoBasketOutline,
  RiCoupon3Line,
  IoScanOutline,
  MdOutlineAccountCircle,
  MdOutlineSecurity,
  IoReceiptOutline,
  LuLayoutDashboard,
  MdOutlineCampaign,
  MdOutlinePersonSearch,
  MdOutlinePhotoLibrary,
  MdOutlinePermMedia,
  MdOutlinePeople,
  MdOutlineGroups2,
  MdOutlinePayment,
  AiOutlineShop,
  TbPigMoney
};

const AccountMenu = (props) => {
  const {
    links, isMenuOpen,
    toggleMenu, signOut,
    isLightMode, toggleDashboardTheme
  } = props;

  const dispatch = useDispatch();
  const handleThemeToggle = () => {
    const newMode = !isLightMode;
    localStorage.setItem('isLightMode', newMode);
    dispatch(toggleDashboardTheme(newMode));
    document.body.classList.toggle('light-mode', newMode);
    document.body.classList.toggle('dark-mode', !newMode);
  };
  return (
    <>
    <CSidebar className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white'} border-end`} position='fixed' visible={isMenuOpen}>
      <CSidebarHeader className='sidebarheader'>
        <CSidebarBrand as={'div'}>
            <Link to={"/"}>
            <div style={{ padding: '2em 7.85em 2em 1em' }} className="logo bg-black">
                <div className="logo-image" alt="LogoImage" />
            </div>
            </Link>
        </CSidebarBrand>
        <IoCloseOutline style={{ zIndex: '900000' }} className={"p-white cursor-pointer d-lg-none"} size={30} onClick={toggleMenu}/>
      </CSidebarHeader>

      <CSidebarNav style={{ scrollbarWidth: 'thin' }} data-aos="fade-up">
            {links.map((link, index) => {
              const PREFIX = link.prefix ? link.prefix : '';
                const IconComponent = iconMap[link.icon];
              return (
                <CNavItem key={index} className={`${isLightMode ? 'p-black' : 'p-white'} item-hover margin-btm-sm`} href={PREFIX + link.to}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {link.name}
                </CNavItem>
              );
            })}
            <div onClick={signOut} style={{ padding: '.75em', cursor: 'pointer' }}>
              <CiLogout size={25}/>&nbsp;&nbsp;Logout
            </div>
      </CSidebarNav>
    </CSidebar>






    <CSidebar className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white'} border-end d-lg-none`} position='fixed' visible={isMenuOpen}>
        <CSidebarHeader className='sidebarheader'>
        <CSidebarBrand as={'div'}>
            <div style={{ padding: '2em 0em' }} className="logo bg-black">
            <Link to={"/"}>
                <div className="logo-image" alt="LogoImage" />
            </Link>
            </div>
        </CSidebarBrand>
        <IoCloseOutline className={"p-white cursor-pointer d-lg-none close-icon"} size={30} onClick={toggleMenu}/>
      </CSidebarHeader>

      <CFormSwitch
                label={isLightMode ? 'Light Mode' : 'Dark Mode'}
                id='themeToggleSwitch'
                className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white'} switch me-3 d-flex align-items-center gap-2`}
                checked={isLightMode}
                onChange={handleThemeToggle}
              />
      <CSidebarNav data-aos="fade-up">
            {links.map((link, index) => {
              const PREFIX = link.prefix ? link.prefix : '';
                const IconComponent = iconMap[link.icon];
              return (
                <CNavItem key={index} className={`${isLightMode ? 'p-black' : 'p-white'} item-hover margin-btm-sm`} href={PREFIX + link.to}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {link.name}
                </CNavItem>
              );
            })}
            <div onClick={signOut} style={{ padding: '.75em', cursor: 'pointer' }}>
              <CiLogout size={25}/>&nbsp;&nbsp;Logout
            </div>
        </CSidebarNav>
            <CSidebarHeader>
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
    </>
  )
}

export default AccountMenu;
