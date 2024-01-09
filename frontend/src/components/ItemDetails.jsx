import { useItemsContext } from "../hooks/useItemsContext";
import { Link } from "react-router-dom";

import { useAuthContext } from "../hooks/useAuthContext";

const ItemDetails = ({ item }) => {
  const { user } = useAuthContext();
  const { dispatch } = useItemsContext();

  const handleClick = async () => {
    if (!user) {
      setError("not logged in");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/api/items/` + item._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_ITEM", payload: json });
    }
  };
  return (
    <div className="display-card">
      <img src={item.secure_url} alt="" className="img-cropped" />
      <h3>{item.title}</h3>
      <p>${item.price}</p>
      Description:{" "}
      {item.description.map((desc) => (
        <p key={desc.key}>{desc.description}</p>
      ))}
      {item.aveilable && <p style={{ color: "green" }}>Aveilable</p>}
      {!item.aveilable && <p style={{ color: "red" }}>Not Aveilable</p>}
      <p>Qty: {item.qty}</p>
      <Link className="add-item dropdown" to={`/edit/${item._id}`}>
        Edit
      </Link>
      <br></br>
      <a onClick={handleClick} className={"add-item dropdown"}>
        Delete
      </a>
    </div>
  );
};

export default ItemDetails;
