const hdImageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/6/62/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution_2.jpg";

const loadingNote = document.querySelector("[data-loading]");

if (window.OpenSeadragon) {
  const viewer = OpenSeadragon({
    id: "hd-viewer",
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
    tileSources: {
      type: "image",
      url: hdImageUrl,
      buildPyramid: true,
    },
    showNavigator: true,
    showRotationControl: false,
    animationTime: 0.45,
    blendTime: 0.12,
    constrainDuringPan: true,
    visibilityRatio: 0.85,
    minZoomLevel: 0.9,
    maxZoomPixelRatio: 2,
    gestureSettingsMouse: {
      clickToZoom: false,
      dblClickToZoom: true,
    },
    gestureSettingsTouch: {
      pinchToZoom: true,
      flickEnabled: true,
    },
  });

  viewer.addHandler("open", () => {
    loadingNote.hidden = true;
    viewer.viewport.goHome(true);
  });
} else {
  loadingNote.textContent = "No se pudo cargar el visor.";
}
