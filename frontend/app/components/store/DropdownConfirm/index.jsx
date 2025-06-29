import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { FaChevronDown } from 'react-icons/fa';

const DropdownConfirm = (props) => {
  const { className, label = '', children, type } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <div className={`dropdown-confirm ${className}`}>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle nav caret={false}>
          <div className="dropdown-action sm d-flex align-items-center">
            {label}
            <FaChevronDown
              className={`dropdown-caret ms-2 transition-icon ${isOpen ? 'rotate' : ''}`}
            />
          </div>
        </DropdownToggle>
        <DropdownMenu end>{children}</DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default DropdownConfirm;
