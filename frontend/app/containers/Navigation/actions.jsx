import axios from 'axios';
import handleError from '../../utils/error';
import {
  TOGGLE_MENU,
} from './constants';
import { API_URL } from '../../constants';

export const toggleMenu = () => {
    return {
        type: TOGGLE_MENU
    }
}
