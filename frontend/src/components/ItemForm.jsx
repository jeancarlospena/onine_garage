import { useState } from "react";
import { useItemsContext } from "../hooks/useItemsContext";
import ItemDetails from "./ItemDetails";
import { useAuthContext } from "../hooks/useAuthContext";

const ItemForm = () => {
  const { user } = useAuthContext();
  const { items, dispatch } = useItemsContext();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [imageFile, _setImageFile] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionList, setDescriptionList] = useState([]);
  const [error, setError] = useState(null);
  const [currentImageInput, setCurrentImageInput] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  // function buggin(e) {
  //   e.preventDefault();
  //   console.log(imageFile);
  // }

  const setImageFile = async (e) => {
    const img = e.target.files[0];
    setCurrentImageInput(e.target.value);
    const imgToBase64 = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(img);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    _setImageFile(imgToBase64);
  };

  function addDescription(e) {
    e.preventDefault();
    setDescriptionList((currentDescriptions) => {
      return [
        ...currentDescriptions,
        { key: crypto.randomUUID(), description },
      ];
    });
    setDescription("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("not logged in");
      return;
    }
    const item = {
      title,
      price,
      qty,
      description: descriptionList,
      images: imageFile,
    };
    const response = await fetch(`/api/items`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      if (json.emptyFields) {
        setEmptyFields(json.emptyFields);
      }
    }
    if (response.ok) {
      setTitle("");
      setPrice("");
      setDescription("");
      setError(null);
      setEmptyFields([]);
      setDescriptionList([]);
      setCurrentImageInput("");
      dispatch({ type: "CREATE_ITEM", payload: json });
    }
  };
  function removeDescription(e, currDesKey) {
    e.preventDefault();
    setDescriptionList(
      descriptionList.filter(function (desc) {
        return desc.key !== currDesKey;
      })
    );
  }
  return (
    <>
      <div className="form-container">
        <h2 className="add-form-heading">ADMIN PAGE</h2>
        <h2 className="add-form-heading">ADD NEW ITEM:</h2>
        <form className="create" onSubmit={handleSubmit}>
          <label>ITEM NAME:</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes("title") ? "error" : ""}
          />

          <label>ITEM PRICE:</label>
          <input
            type="number"
            min={1}
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className={emptyFields.includes("price") ? "error" : ""}
          />

          <label>QUANTITY:</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <label>IMAGE:</label>
          <input
            value={currentImageInput}
            type="file"
            accept="image/jpg, image/jpeg"
            onChange={setImageFile}
            className={emptyFields.includes("images") ? "error" : ""}
          />

          <label>DESCRIPTION:</label>
          <textarea
            rows="3"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className={
              emptyFields.includes("description") && descriptionList.length == 0
                ? "error"
                : ""
            }
          />
          <button className="form-button" onClick={addDescription}>
            ADD DESCRIPTION
          </button>

          <ul>
            {descriptionList &&
              descriptionList.map((currDes) => (
                <li key={currDes.key}>{currDes.description}</li>
              ))}
          </ul>
          <button className="form-button">ADD ITEM</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
      <div className="img-display-board">
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
        {items &&
          items.map((item) => <ItemDetails key={item._id} item={item} />)}
      </div>
    </>
  );
};

export default ItemForm;
