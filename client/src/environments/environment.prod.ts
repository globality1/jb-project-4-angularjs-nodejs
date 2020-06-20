import { store } from 'src/app/redux/store';

export const environment = {
  production: true
};


export const apiBaseURL = "http://localhost:3000/api";

export const authHeaders = {

  createHeader(token) {
   return {
    authorization: "Bearer " + store.getState().token
  }
  }
}
