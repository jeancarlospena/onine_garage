// import { useEffect, useState } from "react";
import { useItemsContext } from "../hooks/useItemsContext.jsx";
import { Link, NavLink } from "react-router-dom";

const Home = () => {
  const { items, isLoading } = useItemsContext();
  return (
    <div className="home">
      <div className="img-display-board">
        {!isLoading &&
          items.map((i) => {
            return (
              <div key={i._id} className="display-card">
                <Link to={`item/${i._id}`}>
                  <img src={i.secure_url} alt="" className="img-cropped" />

                  <h2 className="title">{i.title}</h2>
                </Link>
                <p className="details">${i.price}</p>
                <p className="details">Aveilable: {i.qty}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
