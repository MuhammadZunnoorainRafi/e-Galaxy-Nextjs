import React from 'react';

function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap  ">
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (val, ind) => (
          <div
            key={ind}
            className={`flex-1 border-b-2 text-center  ${
              ind <= activeStep
                ? 'border-b-blue-500  bg-blue-100 font-semibold text-blue-700'
                : 'border-b-slate-600 bg-slate-100 text-slate-600'
            }`}
          >
            {val}
          </div>
        )
      )}
    </div>
  );
}

export default CheckoutWizard;
