import {
  CCardBody,
  CCardTitle,
} from '@coreui/react';
/*import Button from '../../Common/HtmlTags/Button';
import { ROLES } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import Input from '../../Common/HtmlTags/Input';
import { connect } from 'react-redux';
import actions from '../../../actions';
import ManagerPagination from '../Pagination';*/
import ChartDoughnutAndPie from '../Core/donughtAndPieChart';

const AssetDistribution = (props) => {
    const {
        isLightMode, earnings,
        withdrawnAmount, canWithdrawAmount,
        org = false
    } = props;

    const distribution = [
  earnings !== undefined && earnings !== 0 && {
    text: org ? "Total Organizers earnings" : "Earnings",
    color: "#ffffff",
    value: earnings
  },
  canWithdrawAmount !== undefined && canWithdrawAmount >=0 && {
    text: org ? "Amount organizers can withdraw" : "Can Withdraw",
    color: isLightMode ? '#000000' : '#9172EC',
    value: canWithdrawAmount
  },
  withdrawnAmount !== undefined && withdrawnAmount !== 0 && {
    text: "Withdrawn Amount",
    color: '#E06A4A',
    value: withdrawnAmount
  }
].filter(Boolean);


    return (
        <>
        <CCardTitle className={`${isLightMode ? 'p-black': 'p-white'}`} >Asset distribution</CCardTitle>
        <CCardBody className='asset-dis'>
            <div className={`${isLightMode ? 'p-black': 'p-white'} withdrawal-title-and-desc`}>
                <ul>
                    {distribution.map((item, index) => (
                        <li key={index}>
                            <span className='asset-dis-badge' style={{ backgroundColor: item?.color }}></span>
                            <span>{item?.text}</span>
                            <span style={{ paddingLeft: '1em' }}>₦ {item?.value.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='asset-dis-chart'>
            {earnings &&
                <ChartDoughnutAndPie
                    isLightMode={isLightMode}
                    first={earnings}
                />
            }

            {canWithdrawAmount &&
                <ChartDoughnutAndPie
                    isLightMode={isLightMode}
                    second={canWithdrawAmount}
                />
            }
            {withdrawnAmount !== 0 &&
              <ChartDoughnutAndPie
                    isLightMode={isLightMode}
                    third={withdrawnAmount}
              />
            }
            </div>
        </CCardBody>
        </>
    )
}

export default AssetDistribution;
