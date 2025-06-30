/*
 *
 * Dashboard actions
 *
 */

import { TOGGLE_DASHBOARD_MENU, TOGGLE_THEME } from './constants';

export const toggleDashboardMenu = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU
  };
};

export const toggleDashboardTheme = (v) => {
  localStorage.setItem('isLightMode', v);
  return {
    type: TOGGLE_THEME,
    payload: v
  }
}
