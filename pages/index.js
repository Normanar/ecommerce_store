import React from 'react';

const Home = () => {
    return (
        <>
            HeroBanner
            <div className="products-heading">
                <h2>Best selling products!</h2>
                <p>Speakers of many variants</p>
            </div>
            <div className="products-container">
                {['Product1', 'Product2', 'Product3'].map( (product) => product )}
            </div>
            Footer
        </>
    );
};

export default Home;