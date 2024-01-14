// import { useEffect, useState } from "react";
import { useItemsContext } from "../hooks/useItemsContext.jsx";
import { Link, NavLink } from "react-router-dom";
import FlashSale from "../components/FlashSale.jsx";

const Home = () => {
  const { items, isLoading } = useItemsContext();
  return (
    <div className="container">
      <div className="global-padding">
        <h1>All Items For Sale</h1>
      </div>
      <div className="products-display">
        {!isLoading &&
          items.map((item) => {
            return (
              <div key={item._id} className="product">
                <Link to={`item/${item._id}`} className="product-link">
                  <div className="global-padding">
                    <img
                      className="main-product-img"
                      src={item.secure_url}
                      alt=""
                    />
                    <h1 className="product-title">{item.title}</h1>
                  </div>
                </Link>
                <div className="global-padding">
                  <div className="product-info">${item.price}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// <div className="home">
//       <div className="img-display-board">
//         {!isLoading &&
//           items.map((i) => {
//             return (
//               <>
//                 <div key={i._id} className="display-card">
//                   <div className="padd">
//                     <Link to={`item/${i._id}`}>
//                       <img src={i.secure_url} alt="" className="img-cropped" />

//                       <h2 className="title">{i.title}</h2>
//                     </Link>
//                     <p className="details">${i.price}</p>
//                     <p className="details">Aveilable: {i.qty}</p>
//                   </div>
//                 </div>
//               </>
//             );
//           })}
//       </div>
//     </div>

export default Home;
