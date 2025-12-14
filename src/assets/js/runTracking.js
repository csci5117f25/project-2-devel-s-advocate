//Acts as a wrapper for geolocation.watchPosition, updates the store with new points periodically when run is active

import { useRunStore } from './runStore.js'
import simplify from 'simplify-js'

export function useRunTracking(mapRef) {
  const store = useRunStore()
  let watchId = null
  let lastUpdate = 0
  const UPDATE_INTERVAL = 4000
  const TOLERANCE = 0.000015

  const startTracking = async () => {
    store.reset()
    store.start()

    watchId = navigator.geolocation.watchPosition(onPosition, console.error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })

    //Center map on user
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      mapRef.value.setCenter({ lat: latitude, lng: longitude })
      mapRef.value.setZoom(18)
    })
  }

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId)
    watchId = null
    store.stop()
    updatePolyline() //Update one last time
  }

  //Callback for watchposiition
  const onPosition = async (pos) => {
    const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    store.addPoint(p)
    // console.log('New position: ', p)

    // Center map on current position
    mapRef.value.setCenter({ lat: p.lat, lng: p.lng })

    if (store.track.length > 1) {
      const prev = store.track[store.track.length - 2]
      const meters = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(prev.lat, prev.lng),
        new window.google.maps.LatLng(p.lat, p.lng),
      )
      store.addDistance(meters)
    }

    const now = Date.now()
    if (now - lastUpdate > UPDATE_INTERVAL) {
      updatePolyline()
      lastUpdate = now
    }
  }

  //Update polyline in store
  const updatePolyline = () => {
    if (store.track.length < 2) return

    const simplified = simplify(
      store.track.map((p) => ({ x: p.lat, y: p.lng })),
      TOLERANCE,
      true,
    )
    //Simplify polyline for more effficient display
    const path = simplified.map((p) => ({ lat: p.x, lng: p.y }))
    store.polyline?.setPath(path)
  }

  const centerMapOnUser = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      })
      const { latitude, longitude } = position.coords
      // console.log('Centered map on user location:', latitude, longitude)
      return position
    } catch (error) {
      console.warn('Could not get current position:', error)
      return null
    }
  }

  return { startTracking, stopTracking, centerMapOnUser }
}
