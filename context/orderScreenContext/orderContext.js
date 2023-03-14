import OrderReducer from './orderReducer';

const { createContext, useReducer } = require('react');

const OrderScreenContext = createContext();

export const OrderScreenProvider = ({ children }) => {
  const initialState = {
    loading: true,
    order: {},
    error: '',
  };

  const [state, dispatch] = useReducer(OrderReducer, initialState);

  return (
    <OrderScreenContext.Provider
      value={{
        order: state.order,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </OrderScreenContext.Provider>
  );
};

export default OrderScreenContext;
