import {
  CHeader,
  CContainer,
  CHeaderToggler,
  CAvatar,
} from '@coreui/react';
import { CgMenuRightAlt } from "react-icons/cg";
import { cilMenu } from '@coreui/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css'

const HeaderPanel = (props) => {
  const { user, toggleMenu, isMenuOpen } = props

  // Use companyName or userName
  const source = user?.companyName || user?.userName || ''
  const initials = source
    .trim()
    .split(/\s+/)
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <CHeader
      className='bg-black mb-4'
      position='sticky'
      style={{ height: '4em', borderBottom: 'none' }}
    >
      <CContainer fluid className='d-flex justify-content-between align-items-center h-100'>
        <CHeaderToggler onClick={toggleMenu}>
          <CgMenuRightAlt className="p-white" size={30}/>
        </CHeaderToggler>

        <CAvatar
          className='c-primary'
          style={{
            color: 'white',
            fontWeight: 'bold',
            width: '2.2em',
            height: '2.2em',
            fontSize: '1.2em',
          }}
        >
          {initials}
        </CAvatar>
      </CContainer>
    </CHeader>
  )
}

export default HeaderPanel;
