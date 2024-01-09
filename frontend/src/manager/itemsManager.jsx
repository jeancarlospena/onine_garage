const getSingleItem = async (itemId) => {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  return json;
};

export { getSingleItem };
