import axios from 'axios'

export default class Cards {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:8000/api/'
  }

  getCardsFromColumn(name) {
    return axios.get(`cards/${name}`);
  }

  add(id, card) {
    return axios.post(`cards/${id}`, card)
  }

  changeColumn(id, toId) {
    return axios.put(`cards/${id}/${toId}`)
  }

}

export const cards = new Cards()