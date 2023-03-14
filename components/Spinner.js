import React from 'react';
import { ColorRing } from 'react-loader-spinner';
// import Layout from './Layout';

function Spinner({ height, width }) {
  return (
    <>
      <div className="flex min-h-[50vh] items-center justify-center  ">
        <ColorRing
          visible={true}
          height={height}
          width={width}
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['blue', 'blue', 'blue', 'blue', 'blue']}
        />
      </div>
    </>
  );
}

Spinner.defaultProps = {
  height: 100,
  width: 100,
};

export default Spinner;
