import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className="float-left mt-3">
        <h1 className="display-4">Movie Reviews</h1>
        <p className="text-muted float-left">
          Powered by <a href="https://developer.nytimes.com/apis" target="_blank">Newyork Times API</a>
        </p>
      </div>
    ); 
  }
}

export default Header;