export const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
export const AUTO_COMPLETE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
export const API_KEY = "AIzaSyCm4dKU1CA6ezOeoCGUuoj833RoRglEtZw";
import axios from "axios";

export const GET_ADDRESS_FROM_LATLNG = (lat, long) =>
  axios.get(GEOCODE_URL, {
    params: {
      latlng: lat + "," + long,
      key: API_KEY,
    },
  });
export const GET_LOCATION_LIST = (input) =>
  axios.get(AUTO_COMPLETE_URL, {
    params: {
      input,
      key: API_KEY,
      locationbias: "circle:16000@21.028511,105.804817",
    },
  });
export const GET_LATLNG_FROM_ADDRESS = (address) =>
  axios.get(GEOCODE_URL, {
    params: {
      address,
      key: API_KEY,
    },
  });
