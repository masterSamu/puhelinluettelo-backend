import axios from "axios";
const baseURL = "/api/persons";

const getAll = () => {
  const request = axios.get(baseURL);
  return request.then((response) => {
    return response.data;
  });
};

const create = (newObject) => {
  const request = axios.post(baseURL, newObject);
  return request
    .then((response) => {
      return response.data;
    })
};

const deleteItem = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request
    .then(() => {
      return "deleted";
    })
};

const update = (newObject) => {
  const request = axios.put(`${baseURL}/${newObject.id}`, newObject);
  return request
    .then((response) => {
      return response.data;
    })
};

const exportedObject = {
  getAll,
  create,
  deleteItem,
  update,
};
export default exportedObject;
