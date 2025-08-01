import {
  WITHDRAWALS,
  WITHDRAWAL,
  SET_WITHDRAWAL_LOADING,
  SET_EARNINGS,
  SET_WITHDRAWN_AMOUNT,
  SET_WITHDRAWAL_COMMISSION,
  SET_CAN_WITHDRAWAL_AMOUNT,
  RESET_WITHDRAWAL,
  SET_WITHDRAWAL_PAGINITION,
  INITIALISE_WITHDRAWAL,
  SET_WITHDRAWAL_ORGANIZER,
  CLEAR_WITHDRAWAL_ORGANIZER,
  SET_PROCESSING_WITHDRAWAL
} from './constants';

import {
  getSelectedOrganizerFromStorage,
  saveSelectedOrganizerToStorage
} from '../../utils/selectedOrganizer';

const initialState = {
  withdrawals: [],
  withdrawal: {},
  withdrawalIsLoading: false,
  earnings: 0,
  withdrawnAmount: 0,
  commission: 0,
  canWithdrawAmount: 0,
  organizerId: getSelectedOrganizerFromStorage(),

  withdrawalPaginated: [],
  withdrawalPage: 1,
  withdrawalPageCount: 1,
  proccessingWithdrawals: []
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROCESSING_WITHDRAWAL:
      const existingIds = state.proccessingWithdrawals.map(w => w._id);
      const newWithdrawals = action.payload.filter(w => !existingIds.includes(w._id));

      return {
        ...state,
        proccessingWithdrawals: [...state.proccessingWithdrawals, ...newWithdrawals]
      };
    case CLEAR_WITHDRAWAL_ORGANIZER:
      localStorage.removeItem('organizerId');
      return {
        ...state,
        organizerId: null
      }
    case SET_WITHDRAWAL_ORGANIZER:
      saveSelectedOrganizerToStorage(action.payload)
      return {
        ...state,
        organizerId: action.payload
      }
    case INITIALISE_WITHDRAWAL:
      const updatedMap = new Map(action.payload.map(w => [w._id, w]));
        return {
          ...state,
          withdrawals: state.withdrawals.map(w =>
          updatedMap.has(w._id) ? updatedMap.get(w._id) : w
        ),
      }
    case SET_CAN_WITHDRAWAL_AMOUNT:
      return {
        ...state,
        canWithdrawAmount: action.payload
      };
    case SET_WITHDRAWAL_PAGINITION:
      return {
        ...state,
        withdrawalPaginated: action.payload.withdrawals,
        withdrawalPage: action.payload.page,
        withdrawalPageCount: action.payload.pageCount
      }
    case RESET_WITHDRAWAL:
      return {
        ...state,
        withdrawalPage: 1,
        withdrawalTotalPages: 1,
        withdrawals: [],
        withdrawalPaginated: [],
        withdrawnAmount: 0,
      }
    case SET_WITHDRAWAL_COMMISSION:
      return {
        ...state,
        commission: action.payload
      };
    case SET_WITHDRAWAL_LOADING:
      return {
        ...state,
        withdrawalIsLoading: action.payload
      };

    case WITHDRAWALS:
      return {
        ...state,
        withdrawals: action.payload
      };

    case WITHDRAWAL:
      return {
        ...state,
        withdrawal: action.payload
      };

    case SET_EARNINGS:
      return {
        ...state,
        earnings: action.payload
      };

    case SET_WITHDRAWN_AMOUNT:
      return {
        ...state,
        withdrawnAmount: action.payload
      };

    default:
      return state;
  }
};

export default withdrawalReducer;
