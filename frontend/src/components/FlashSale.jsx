import { Link } from "react-router-dom";
const FlashSale = () => {
  return (
    <ul className="flash-sale">
      <Link to={"/"}>
        <li className="flash-sale-text">Garage Sale</li>
      </Link>
    </ul>
  );
};

export default FlashSale;
