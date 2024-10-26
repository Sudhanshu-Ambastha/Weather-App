import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=28.682798845448065&lon=77.34939915991103"; // Ghaziabad, Uttar Pradesh, India

const currentLocation = function() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            updateWeather(`lat=${latitude}`, `lon=${longitude}`);
        },
        error => {
            console.error("Error getting location:", error.message);
            window.location.hash = defaultLocation;
        }
    );
};

/**
 * @param {string} query Search query
 */
const searchLocation = query => updateWeather(...query.split("&"));

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchLocation]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});
