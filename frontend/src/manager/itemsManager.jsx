const getSingleItem = async (itemId) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}/api/items/${itemId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await response.json();
  return json;
};

export { getSingleItem };
