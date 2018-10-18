import axios from 'axios'

export default class Columns {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:8000/api/'
  }

  getAll() {
    return axios.get(`columns`);
  }

  getById(id) {
    return axios.get(`columns/${id}`)
  }

  setCapacity(id, column) {
    return axios.put(`columns/${id}/capacity`, column);
  }

  updateCards(id, column) {
    return axios.put(`columns/${id}/cards`, column);
  }

}

export const columns = new Columns()