import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';

const DropdownConfirm = props => {
  const { className, parent, children } = props;

  return (
    <div className={`dropdown-confirm ${className}`}>
      <UncontrolledButtonDropdown>
        <DropdownToggle nav>
          <div className='dropdown-action sm'>
            {parent}
            <span className='fa fa-chevron-down dropdown-caret'></span>
          </div>
        </DropdownToggle>
        <DropdownMenu right>{children}</DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
};

DropdownConfirm.defaultProps = {
  parent: ''
};

export default DropdownConfirm;