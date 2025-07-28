/*
 *
 * Product actions
 *
 */

import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

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
  SET_DELIVERY_INFO,
  SET_NEEDS_DELIVERY,
  PRODUCT_COLOR_IMAGE_REMOVE
} from './constants';
import { vewingEventToggler } from '../Events/actions';

export const setNeedsDelivery = (v) => {
  return {
    type: SET_NEEDS_DELIVERY,
    payload: v
  }
}

export const setDeliveryInfo = (info) => ({
  type: SET_DELIVERY_INFO,
  payload: info
});

export const productChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: PRODUCT_CHANGE,
    payload: formData
  };
};

export const productEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: PRODUCT_EDIT_CHANGE,
    payload: formData
  };
};

export const productShopChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: PRODUCT_SHOP_CHANGE,
    payload: formData
  };
};

export const resetProduct = () => {
  return {
    type: RESET_PRODUCT
  };
};

export const setProductLoading = (value) => {
  return {
    type: SET_PRODUCTS_LOADING,
    payload: value
  };
};

export const resetAdvancedFilters = () => {
  return {
    type: RESET_ADVANCED_FILTERS
  };
};

export const productImageToRemove = (v) => {
  return {
    type: PRODUCT_IMAGE_REMOVE,
    payload: v
  }
}

export const productColorAndImageToRemove = (v) => {
  return {
    type: PRODUCT_COLOR_IMAGE_REMOVE,
    payload: v
  }
}

export const filterProducts = (filterType, value) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProductLoading(true));
      const advancedFilters = getState().product.advancedFilters;
      const payload = productsFilterOrganizer(filterType, value, advancedFilters);
      
      dispatch({ type: SET_ADVANCED_FILTERS, payload });
      
      const response = await axios.get(`${API_URL}/product/store`, {
        params: payload
      });
      
      const { products } = response.data;
      
      dispatch({
        type: FETCH_STORE_PRODUCTS,
        payload: products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const resetProductSlugChange = () => {
  return {
    type: PRODUCT_SLUG_CHANGED,
    paylaod: false
  }
}

// Fetch store product by slug
export const fetchStoreProduct = (slug) => {
  return async (dispatch, getState) => {
    dispatch(vewingEventToggler(true))
    dispatch(setProductLoading(true));
    try {
      const response = await axios.get(`${API_URL}/product/item/${slug}`);
      const product = response.data.product;
      const authenticated = getState().authentication.authenticated;
      const user = getState().account.user;
      dispatch({
        type: FETCH_STORE_PRODUCT,
        payload: product
      });

      // get user from state so a logged in user stays auto filled
      const name = user?.organizer ? user?.organizer?.companyName : user?.name
      const phoneNumber = user?.phoneNumber?.length > 0 ? user?.phoneNumber : ''
      dispatch({
        type: SET_DELIVERY_INFO,
        payload: {
          name: authenticated ? name : '',
          email: authenticated ? user.email : '',
          phoneNumber: phoneNumber,
          address: {
            street: '',
            city: '',
            state: 'Lagos',
            island: false,
            mainland: false,
            deliveryFee: 0
          }
        }
      })
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch({
          type: PRODUCT_SLUG_CHANGED,
          payload: true
        });
      }
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// Fetch store products
export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const response = await axios.get(`${API_URL}/product/store`);
      const { products } = response.data;
      
      dispatch({
        type: FETCH_STORE_PRODUCTS,
        payload: products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// Admin: Fetch all products
export const fetchAllProducts = () => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const response = await axios.get(`${API_URL}/product`);
      const { products } = response.data;
      
      dispatch({
        type: FETCH_PRODUCTS,
        payload: products
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// Admin: Fetch single product
export const fetchProduct = (id) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const response = await axios.get(`${API_URL}/product/${id}`);
      const product = response.data.product;
      
      dispatch({
        type: FETCH_PRODUCT,
        payload: product
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// Admin: Add product
export const addProduct = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setProductLoading(true));
    try {
      const rules = {
        name: 'required',
        description: 'required|max:5000',
        quantity: 'required|numeric',
        price: 'required|numeric',
        image: 'required'
      };

      const product = getState().product.productFormData;
      console.log(product)
      
      const newProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        quantity: product.quantity,
        sku: product.sku,
        image: product.image,
        isActive: product.isActive,
        sizeQuantity: JSON.stringify(product.sizeQuantity || []),
        colorAndImage: JSON.stringify(product.colorAndImage || [])
      };

      const { isValid, errors } = allFieldsValidation(newProduct, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.quantity': 'Quantity is required.',
        'numeric.quantity': 'Quantity must be a number.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.',
        'required.image': 'Image is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_PRODUCT_FORM_ERRORS, payload: errors });
      }

      const formData = new FormData();
      for (const key in newProduct) {
        if (newProduct.hasOwnProperty(key)) {
          if (key === 'image') {
            for (const file of newProduct.image) {
              formData.append('images', file);
            }
          } else {
            formData.set(key, newProduct[key]);
          }
        }
      }

      // Append images (ensure the order matches colorAndImage array)
      if (Array.isArray(product.colorAndImage)) {
        product.colorAndImage.forEach(entry => {
          if (Array.isArray(entry.imageUrl)) {
            entry.imageUrl.forEach(file => {
              formData.append('images', file);
            });
          }
        });
      }

      const response = await axios.post(`${API_URL}/product/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({
          type: ADD_PRODUCT,
          payload: response.data.product
        });
        dispatch(resetProduct());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error saving product, try again!');
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// Admin: Update product
export const updateProduct = (navigate) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PRODUCTS_LOADING, payload: true });

    try {
      const product = getState().product.product;
      const removeImage = getState().product.imageToRemove || [];
      const colorAndImageToRemove = getState().product.colorAndImageToRemove || [];

      const rules = {
        name: 'required',
        description: 'required|max:5000',
        quantity: 'required|numeric',
        price: 'required|numeric'
      };

      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        quantity: product.quantity,
        sku: product.sku,
        isActive: product.isActive,
        image: product.image || [],
        sizeQuantity: JSON.stringify(product.SizeQuantity || []),
        colorAndImage: JSON.stringify(product.colorAndImage || [])
      };

      const { isValid, errors } = allFieldsValidation(payload, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.quantity': 'Quantity is required.',
        'numeric.quantity': 'Quantity must be a number.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_PRODUCT_FORM_EDIT_ERRORS,
          payload: errors
        });
      }

      // Construct FormData
      const formData = new FormData();
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          if (key === 'image') {
            for (const file of payload.image) {
              formData.append('images', file);
            }
          } else {
            formData.set(key, payload[key]);
          }
        }
      }
      removeImage.forEach((str) => {
        formData.append('removeImage', str);
      });
      formData.append('colorAndImageToRemove', JSON.stringify(colorAndImageToRemove));

      // Append images (ensure the order matches colorAndImage array)
      if (Array.isArray(product.colorAndImage)) {
        product.colorAndImage.forEach(entry => {
          if (Array.isArray(entry.imageUrl)) {
            entry.imageUrl.forEach(file => {
              formData.append('images', file);
            });
          }
        });
      }

      const response = await axios.put(
        `${API_URL}/product/${product._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: RESET_PRODUCT });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error updating product, try again!');
    } finally {
      dispatch({ type: SET_PRODUCTS_LOADING, payload: false });
    }
  };
};

// Admin: Delete product
export const deleteProduct = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/product/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_PRODUCT, payload: id });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error deleting product');
    }
  };
};
