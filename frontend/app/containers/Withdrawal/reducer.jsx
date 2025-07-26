import {
  WITHDRAWALS,
  WITHDRAWAL,
  SET_WITHDRAWAL_LOADING,
  SET_EARNINGS,
  SET_WITHDRAWN_AMOUNT
} from './constants';

const initialState = {
  withdrawals: [],
  withdrawal: {},
  withdrawalIsLoading: false,
  earnings: 0,
  withdrawnAmount: 0
};

export const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
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
