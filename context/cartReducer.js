import Cookies from 'js-cookie';

function cartReducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEMS': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (x) => x.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((val) => {
            return val.name === existItem.name ? newItem : val;
          })
        : [...state.cart.cartItems, newItem];
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case 'REMOVE_CART_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: action.payload } };
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'CART_CLEAR_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    default:
      return state;
  }
}

export default cartReducer;
