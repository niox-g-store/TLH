/*
 *
 * Product reducer
 *
 */

import {
  FETCH_PRODUCTS,
  FETCH_STORE_PRODUCTS,
  FETCH_PRODUCT,
  FETCH_STORE_PRODUCT,
  PRODUCT_CHANGE,
  PRODUCT_EDIT_CHANGE,
  PRODUCT_SHOP_CHANGE,
  SET_PRODUCT_FORM_ERRORS,
  SET_PRODUCT_FORM_EDIT_ERRORS,
  RESET_PRODUCT,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  SET_PRODUCTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS,
  PRODUCT_SLUG_CHANGED,

  PRODUCT_IMAGE_REMOVE,
} from './constants';

const initialState = {
  products: [],
  storeProducts: [],
  product: {
    _id: ''
  },
  storeProduct: {},
  productSlugChange: false,
  productFormData: {
    sku: '',
    name: '',
    description: '',
    quantity: 1,
    price: 1,
    discountPrice: 0,
    image: [],
    isActive: true
  },
  isLoading: false,
  productShopData: {
    quantity: 1
  },
  formErrors: {},
  editFormErrors: {},
  advancedFilters: {
    min: 0,
    max: 1000000,
    rating: 0,
    order: 0, // 0: newest first, 1: price high to low, 2: price low to high
    page: 1,
    limit: 12
  },
  imageToRemove: []
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_IMAGE_REMOVE:
      return {
        ...state,
        imageToRemove: [...state.imageToRemove, action.payload]
      }
    case PRODUCT_SLUG_CHANGED:
      return {
        ...state,
        productSlugChange: action.payload
      };
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    case FETCH_STORE_PRODUCTS:
      return {
        ...state,
        storeProducts: action.payload
      };
    case FETCH_PRODUCT:
      return {
        ...state,
        product: action.payload,
        editFormErrors: {}
      };
    case FETCH_STORE_PRODUCT:
      return {
        ...state,
        storeProduct: action.payload,
        productSlugChange: false,
        productShopData: {
          quantity: 1
        }
      };
    case SET_PRODUCTS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload)
      };
    case PRODUCT_CHANGE:
      return {
        ...state,
        productFormData: {
          ...state.productFormData,
          ...action.payload
        }
      };
    case PRODUCT_EDIT_CHANGE:
      return {
        ...state,
        product: {
          ...state.product,
          ...action.payload
        }
      };
    case PRODUCT_SHOP_CHANGE:
      return {
        ...state,
        productShopData: {
          ...state.productShopData,
          ...action.payload
        }
      };
    case SET_PRODUCT_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_PRODUCT_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case RESET_PRODUCT:
      return {
        ...state,
        productFormData: {
          sku: '',
          name: '',
          description: '',
          quantity: 1,
          price: 1,
          discountPrice: 0,
          image: [],
          isActive: true
        },
        product: {
          _id: ''
        },
        formErrors: {},
        editFormErrors: {},
        imageToRemove: []
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case RESET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          min: 0,
          max: 1000000,
          rating: 0,
          order: 0,
          page: 1,
          limit: 12
        }
      };
    default:
      return state;
  }
};

export default productReducer;