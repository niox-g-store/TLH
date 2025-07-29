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
        {
            "text": org ? "Total Organizers earnings" : "Earnings",
            "color": "#ffffff",
            value: earnings || 0
        },
        {
            "text": org ? "amount organizers can withdraw" : "Can Withdraw",
            "color": `${isLightMode ? '#000000' : '#9172EC'}`,
            value: canWithdrawAmount || 0
        },
    ]

    return (
        <>
        <CCardTitle style={{ paddingLeft: '1em' }}>Asset distribution</CCardTitle>
        <CCardBody className='asset-dis'>
            <div className='withdrawal-title-and-desc'>
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
            </div>
        </CCardBody>
        </>
    )
}

export default AssetDistribution;
