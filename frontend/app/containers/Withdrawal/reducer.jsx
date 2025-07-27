import {
  WITHDRAWALS,
  WITHDRAWAL,
  SET_WITHDRAWAL_LOADING,
  SET_EARNINGS,
  SET_WITHDRAWN_AMOUNT,
  SET_WITHDRAWAL_COMMISSION,
  RESET_WITHDRAWAL,
  SET_WITHDRAWAL_PAGINITION,
} from './constants';

const initialState = {
  withdrawals: [],
  withdrawal: {},
  withdrawalIsLoading: false,
  earnings: 0,
  withdrawnAmount: 0,
  commission: 0,

  withdrawalPaginated: [],
  withdrawalPage: 1,
  withdrawalPageCount: 1,
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
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
