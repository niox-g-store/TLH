import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import { FaChevronDown } from 'react-icons/fa'

const PeriodDropdown = (props) => {
  const { className } = props;
  return (
    <CDropdown className="ms-auto">
      <CDropdownToggle color="light" size="sm" className={`${className} text-dark d-flex align-items-center gap-1`}>
        This Month 
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem>Today</CDropdownItem>
        <CDropdownItem>This Week</CDropdownItem>
        <CDropdownItem>This Month</CDropdownItem>
        <CDropdownItem>Select Date</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}
export default PeriodDropdown
