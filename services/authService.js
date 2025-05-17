// Complete authService.js file

// Use your computer's actual IP address for physical devices
const API_URL = 'http://192.168.1.104:3000';

// API endpoints according to the documentation
const API_ENDPOINTS = {
  SIGNUP: '/users/signup',
  SIGNIN: '/users/signin',
  UPDATE_USER: '/users/update',
  CART: '/cart',
  ORDERS: '/orders'
};

// User Authentication API Calls
export const authService = {
  // Sign Up a new user
  signUp: async (name, email, password) => {
    try {
      console.log('Attempting to register with:', { name, email, password });
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.SIGNUP}`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log('Register response status:', response.status);
      const data = await response.json();
      console.log('Register response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to register user');
      }
      
      return {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
        },
        token: data.token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Sign In an existing user
  signIn: async (email, password) => {
    try {
      console.log('Attempting to login with:', { email, password });
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.SIGNIN}`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.SIGNIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to sign in');
      }
      
      return {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
        },
        token: data.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, token, userData) => {
    try {
      console.log('Updating profile:', userData);
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.UPDATE_USER}`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.UPDATE_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          password: userData.password,
        }),
      });

      console.log('Update profile response status:', response.status);
      const data = await response.json();
      console.log('Update profile response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      return {
        id: userId,
        name: data.name,
        email: userData.email, // We keep the existing email since it doesn't change
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Get cart items
  getCart: async (token) => {
    try {
      console.log('Fetching cart with token:', token);
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.CART}`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.CART}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get cart response status:', response.status);
      const data = await response.json();
      console.log('Get cart response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to fetch cart');
      }
      
      // Convert server cart format to app cart format
      // Server format: { id, price, count }
      // App format: { id, price, quantity, ... }
      if (data.items && Array.isArray(data.items)) {
        return data.items.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.count,
          // Other fields will be filled in by the Cart component
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  },

  // Update cart items
  updateCart: async (token, items) => {
    try {
      console.log('Updating cart with token:', token);
      console.log('Updating cart with items:', items);
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.CART}`);
      
      // Convert items to the format expected by the server
      const formattedItems = items.map(item => ({
        id: item.id,
        price: item.price,
        count: item.quantity || item.count || 1 // Support both formats
      }));
      
      console.log('Formatted items for server:', formattedItems);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.CART}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: formattedItems
        }),
      });

      console.log('Update cart response status:', response.status);
      const data = await response.json();
      console.log('Update cart response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to update cart');
      }
      
      return data;
    } catch (error) {
      console.error('Update cart error:', error);
      throw error;
    }
  },

  // Get orders
  getOrders: async (token) => {
    try {
      console.log('Fetching orders');
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.ORDERS}/all`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS}/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Get orders response status:', response.status);
      const data = await response.json();
      console.log('Get orders response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      
      return data.orders;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },
  
  // Create a new order
  createOrder: async (token, items) => {
    try {
      console.log('Creating new order with items:', items);
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.ORDERS}/neworder`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS}/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            prodID: item.prodID || item.id,
            price: item.price,
            quantity: item.quantity
          }))
        }),
      });

      console.log('Create order response status:', response.status);
      const data = await response.json();
      console.log('Create order response data:', data);
      
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Failed to create order');
      }
      
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },
  
  // Update order status
  updateOrder: async (token, orderId, isPaid, isDelivered) => {
    try {
      console.log('Updating order status:', { orderID: orderId, isPaid, isDelivered });
      console.log('API URL:', `${API_URL}${API_ENDPOINTS.ORDERS}/updateorder`);
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS}/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderID: orderId,
          isPaid,
          isDelivered
        }),
      });

      console.log('Update order response status:', response.status);
      const data = await response.json();
      console.log('Update order response data:', data);
      
      return data;
    } catch (error) {
      console.error('Update order error:', error);
      throw error;
    }
  }
};