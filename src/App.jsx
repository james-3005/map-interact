import "./App.css";
import { useEffect, useState } from "react";
import { GET_ADDRESS_FROM_LATLNG } from "./location.js";
import * as XLSX from "xlsx";

const HANOI_CENTER = { lat: 21.028511, lng: 105.804817 };

function App() {
  const [location, setLocation] = useState();
  const [listPoint, setListPoint] = useState([]);
  const [data, setData] = useState([]);
  function initMap() {
    // init map
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: HANOI_CENTER,
    });

    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: HANOI_CENTER,
    });

    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();

      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      setLocation({
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng(),
      });
      const lat = mapsMouseEvent.latLng.lat();
      const lng = mapsMouseEvent.latLng.lng();
      setLocation({ lat, lng });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });

    const markers = [];
    fetch("/map-point.xlsx")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        setData(data);
        data.forEach(function (row) {
          const marker = new google.maps.Marker({
            position: { lat: row.lat, lng: row.lng },
            map: map,
            label: `${row.index || ""}/${
              row.index % 7 === 0 ? row.index / 7 + 1 : Math.ceil(row.index / 7)
            }`,
          });
          markers.push(marker);
        });
      });
  }

  useEffect(() => {
    initMap();
  }, []);
  const addLocationToList = async () => {
    GET_ADDRESS_FROM_LATLNG(location.lat, location.lng).then((res) => {
      console.log(res);
      setListPoint((pre) => [
        ...pre,
        [
          pre.length,
          res.data.results[0].formatted_address,
          location.lat,
          location.lng,
        ],
      ]);
    });
  };
  const logList = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a worksheet to the workbook and fill it with data
    console.log(listPoint);
    const worksheet = XLSX.utils.aoa_to_sheet(listPoint);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate the binary data for the xlsx file
    const binaryData = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the binary data
    const blob = new Blob([binaryData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a URL that can be used to download the xlsx file
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = "array_to_xlsx.xlsx";
    link.click();
  };
  return (
    <div id="App">
      <div id="map"></div>
      <button
        style={{ position: "absolute", top: 0, left: 0, width: 200 }}
        onClick={addLocationToList}
      >
        Add
      </button>
      <button
        style={{ position: "absolute", top: 20, left: 0, width: 200 }}
        onClick={logList}
      >
        Log
      </button>
    </div>
  );
}

export default App;
