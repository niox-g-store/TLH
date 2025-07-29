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
    const { isLightMode, earnings, withdrawnAmount } = props;

    const distribution = [
        {
            "text": "Earnings",
            "color": "#ffffff",
            value: earnings
        },
        {
            "text": "Can Withdraw",
            "color": `${isLightMode ? '#000000' : '#9172EC'}`,
            value: earnings - withdrawnAmount
        },
        {
            "text": "Withdrawals",
            "color": "#E06A4A",
            value: withdrawnAmount
        }
    ]

    return (
        <>
        <CCardTitle style={{ paddingLeft: '1em' }}>Asset distribution</CCardTitle>
        <CCardBody className='asset-dis'>
            <div className='withdrawal-title-and-desc'>
                <ul>
                    {distribution.map((item, index) => (
                        <li key={index}>
                            <span className='asset-dis-badge' style={{ backgroundColor: item.color }}></span>
                            <span>{item.text}</span>
                            <span style={{ paddingLeft: '1em' }}>₦ {item.value.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <ChartDoughnutAndPie
                isLightMode={isLightMode}
                earnings={earnings}
                withdrawals={withdrawnAmount}
                canWithdraw={earnings - withdrawnAmount}
            />
        </CCardBody>
        </>
    )
}

export default AssetDistribution;
