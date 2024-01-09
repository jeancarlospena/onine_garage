import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

const Edit = () => {
  const { user } = useAuthContext();
  // const { dispatch } = useItemsContext();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [imageFile, _setImageFile] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionList, setDescriptionList] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [currentImageInput, setCurrentImageInput] = useState("");
  const [currentItemImage, setCurrentItemImage] = useState("");
  const [replaceImageDeleteId, setReplaceImageDeleteId] = useState("");
  const [data, setData] = useState([]);
  const paramsId = useParams().id;
  const [aveilable, setAveilable] = useState(Boolean);

  const navigate = useNavigate();

  function removeDescription(e, currDesKey) {
    e.preventDefault();
    setDescriptionList(
      descriptionList.filter(function (desc) {
        return desc.key !== currDesKey;
      })
    );
  }

  const url = `/api/items/${paramsId}`;

  const fetchInfo = async () => {
    const response = await fetch(url);
    const d = await response.json();
    if (response.ok) {
      setTitle(d.title);
      setPrice(d.price);
      setQty(d.qty);
      setDescriptionList(d.description);
      setCurrentItemImage(d.secure_url);
      setReplaceImageDeleteId(d.public_id);
      setAveilable(d.aveilable);
    } else {
      setError(d.error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  //

  // function buggin(e) {
  //   e.preventDefault();
  //   console.log(imageFile);
  // }

  const setImageFile = async (e) => {
    setCurrentImageInput(e.target.value);
    const img = e.target.files[0];
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

  const handleAveilabilityCheckbox = (e) => {
    setAveilable(!aveilable);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = {
      title,
      price,
      qty,
      description: descriptionList,
      replaceImageDeleteId,
      aveilable,
    };
    if (imageFile) {
      item.images = imageFile;
    }
    const response = await fetch(`/api/items/${paramsId}`, {
      method: "PATCH",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
      navigate("/");
    }
    if (response.ok) {
      // setTitle("");
      // setPrice("");
      // setDescription("");
      // setCurrentItemImage("");
      // setError(null);
      // setDescriptionList([]);
      navigate("/admin");
    }
  };

  return (
    <div className="form-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2 className="add-form-heading">EDIT ITEM:</h2>
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
        <img src={currentItemImage} alt="" className="img-cropped" />
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
              <li key={currDes.key}>
                {currDes.description}{" "}
                <button onClick={(e) => removeDescription(e, currDes.key)}>
                  Remove
                </button>
              </li>
            ))}
        </ul>
        <p>
          Aveilable:{" "}
          <input
            type="checkbox"
            onChange={handleAveilabilityCheckbox}
            value={aveilable}
            checked={aveilable}
          />
        </p>
        <button className="form-button">UPDATE ITEM</button>
      </form>
    </div>
  );
};

export default Edit;
