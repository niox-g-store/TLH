import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const PeriodDropdown = (props) => {
  const { className, dashboardAnalytics, onApplyFilter, target } = props;
  const [selectedLabel, setSelectedLabel] = useState('This Month');

  const ticketPeriod = dashboardAnalytics?.tickets?.labels?.length > 1
    ? `${dashboardAnalytics.tickets.labels[0]} - ${dashboardAnalytics.tickets.labels.at(-1)}`
    : dashboardAnalytics?.tickets?.labels?.[0] || 'This Month';

  const incomePeriod = dashboardAnalytics?.income?.labels?.length > 1
    ? `${dashboardAnalytics.income.labels[0]} - ${dashboardAnalytics.income.labels.at(-1)}`
    : dashboardAnalytics?.income?.labels?.[0] || 'This Month';

  const textByTarget = {
    tickets: ticketPeriod,
    income: incomePeriod,
    orders: dashboardAnalytics?.orders?.start
      ? `${dashboardAnalytics.orders.start} - ${dashboardAnalytics.orders.end}`
      : 'This Month',
    events: dashboardAnalytics?.events?.start
      ? `${dashboardAnalytics.events.start} - ${dashboardAnalytics.events.end}`
      : 'This Month',
  };

  const currentPeriodText = textByTarget[target] || selectedLabel;

  const handleSelect = (label) => {
    let startDate, endDate;

    switch (label) {
      case 'Today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      }
      case 'This Week': {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);
        const day = now.getDay(); // 0 = Sunday
        const diffToMonday = day === 0 ? 6 : day - 1;

        start.setDate(start.getDate() - diffToMonday);
        start.setHours(0, 0, 0, 0);

        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        startDate = start;
        endDate = end;
        break;
      }
      case 'This Month': {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      }
      case 'All Time': {
        startDate = 'all_time';
        endDate = 'all_time';
        break;
      }
      default:
        return;
    }

    setSelectedLabel(label);

    onApplyFilter({
      target: target.toLowerCase(),
      isRange: true,
      startDate,
      endDate,
    });
  };

  const isDisabled = (label) => {
    if (label === 'All Time') {
      return (
        dashboardAnalytics?.[target]?.start === 'all_time' &&
        dashboardAnalytics?.[target]?.end === 'all_time'
      );
    }

    if (label === 'This Month') {
      const today = new Date();
      return (
        dashboardAnalytics?.[target]?.start &&
        new Date(dashboardAnalytics[target].start).getMonth() === today.getMonth()
      );
    }

    if (label === 'This Week') {
      const now = new Date();
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      startOfWeek.setDate(now.getDate() - diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const recorded = dashboardAnalytics?.[target]?.start;
      return recorded && new Date(recorded).toDateString() === startOfWeek.toDateString();
    }

    if (label === 'Today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recorded = dashboardAnalytics?.[target]?.start;
      return recorded && new Date(recorded).toDateString() === today.toDateString();
    }

    return false;
  };

  return (
    <CDropdown className="ms-auto">
      <CDropdownToggle
        color="light"
        size="sm"
        className={`${className} text-dark d-flex align-items-center gap-1`}
      >
        {currentPeriodText}
      </CDropdownToggle>
      <CDropdownMenu>
        {['Today', 'This Week', 'This Month', 'All Time'].map((label) => (
          <CDropdownItem
            key={label}
            onClick={() => handleSelect(label)}
          >
            {label}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default PeriodDropdown;
