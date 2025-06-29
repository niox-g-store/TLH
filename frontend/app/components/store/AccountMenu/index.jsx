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
} from '@coreui/react'
import { Link } from 'react-router-dom'
import {
  IoTicketOutline, IoBasketOutline,
  IoScanOutline, IoCloseOutline,
  IoReceiptOutline
} from "react-icons/io5";
import { MdOutlineEventRepeat, MdOutlineAccountCircle, MdOutlineSecurity } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";


const iconMap = {
  IoTicketOutline,
  MdOutlineEventRepeat,
  IoBasketOutline,
  RiCoupon3Line,
  IoScanOutline,
  MdOutlineAccountCircle,
  MdOutlineSecurity,
  IoReceiptOutline,
  LuLayoutDashboard
};

const AccountMenu = (props) => {
  const { links, isMenuOpen, toggleMenu, signOut } = props;
  return (
    <>
    <CSidebar className="border-end bg-black" position='fixed' visible={isMenuOpen}>
      <CSidebarHeader className='sidebarheader'>
        <CSidebarBrand as={'div'}>
            <Link to={"/"}>
            <div className="logo">
                <div className="logo-image" alt="LogoImage" />
            </div>
            </Link>
        </CSidebarBrand>
        <IoCloseOutline className={"p-white cursor-pointer d-lg-none"} size={30} onClick={toggleMenu}/>
      </CSidebarHeader>

      <CSidebarNav data-aos="fade-up">
            {links.map((link, index) => {
              const PREFIX = link.prefix ? link.prefix : '';
                const IconComponent = iconMap[link.icon];
              return (
                <CNavItem key={index} className='p-white item-hover margin-btm-sm' href={PREFIX + link.to}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {link.name}
                </CNavItem>
              );
            })}
            <div onClick={signOut} className='p-white' style={{ padding: '.75em', cursor: 'pointer' }}>
              <CiLogout className='p-white' size={25}/>&nbsp;&nbsp;Logout
            </div>
      </CSidebarNav>
        <CSidebarHeader>
          <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>






    <CSidebar className="border-end bg-black d-lg-none" position='fixed' visible={isMenuOpen}>
        <CSidebarHeader className='sidebarheader'>
        <CSidebarBrand as={'div'}>
            <Link to={"/"}>
            <div className="logo">
                <div className="logo-image" alt="LogoImage" />
            </div>
            </Link>
        </CSidebarBrand>
        <IoCloseOutline className={"p-white cursor-pointer d-lg-none close-icon"} size={30} onClick={toggleMenu}/>
      </CSidebarHeader>

      <CSidebarNav data-aos="fade-up">
            {links.map((link, index) => {
              const PREFIX = link.prefix ? link.prefix : '';
                const IconComponent = iconMap[link.icon];
              return (
                <CNavItem key={index} className='p-white item-hover margin-btm-sm' href={PREFIX + link.to}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {link.name}
                </CNavItem>
              );
            })}
            <div onClick={signOut} className='p-white' style={{ padding: '.75em', cursor: 'pointer' }}>
              <CiLogout className='p-white' size={25}/>&nbsp;&nbsp;Logout
            </div>
        </CSidebarNav>
            <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
    </>
  )
}

export default AccountMenu;
