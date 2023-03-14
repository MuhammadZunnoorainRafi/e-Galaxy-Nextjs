import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import cartReducer from './cartReducer';

const { createContext, useReducer } = require('react');

const CartContext = createContext();

const cartItemsCookie = Cookies.get('cart');

export const CartProvider = ({ children }) => {
  const router = useRouter();

  const initialState = {
    cart: cartItemsCookie
      ? JSON.parse(cartItemsCookie)
      : { cartItems: [], shippingAddress: {}, paymentMethod: '' },
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // @desc CART_ADD _ITEMS ------------------
  const handleAddToCart = (product) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      return alert('Sorry, No more items left :(');
    }
    console.log(router.pathname);
    router.pathname === `/product/[slug]` && router.push('/cart');

    dispatch({ type: 'CART_ADD_ITEMS', payload: { ...product, quantity } });
  };

  // @desc REMOVE_CART_ITEMS -----------------
  const handleRemoveItem = (slug) => {
    const cartItems = state.cart.cartItems.filter((val) => {
      return val.slug !== slug;
    });
    Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
    dispatch({ type: 'REMOVE_CART_ITEMS', payload: cartItems });
  };

  // @desc CART_RESET
  const handleCartReset = () => {
    dispatch({ type: 'CART_RESET' });
  };

  // @desc HANDLE_CART_SELECT
  const handleCartSelect = (val, qty) => {
    const quantity = Number(qty);

    dispatch({ type: 'CART_ADD_ITEMS', payload: { ...val, quantity } });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cart.cartItems,
        state,
        dispatch,
        handleRemoveItem,
        handleAddToCart,
        handleCartSelect,
        handleCartReset,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
