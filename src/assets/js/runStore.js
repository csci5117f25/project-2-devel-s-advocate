//Persistent storage for run tracking
import { defineStore } from 'pinia'

export const useRunStore = defineStore('run', {

    //Reactiviity
    state: () => ({
        track: [],
        distance: 0,
        isTracking: false,
        startTime: null,
        polyline: null
    }),

    actions: {
        setPolyline(pl) { this.polyline = pl },
        addPoint(p) { this.track.push(p) },
        addDistance(m) { this.distance += m },
        start() {
            this.isTracking = true
            this.startTime = Date.now()
        },
        stop() { 
            this.isTracking = false 
            console.log('Final distance: ', this.distance)
            console.log('Track points: ', this.track.length)
            console.log('Track data: ', this.track)
        },
        reset() {
            this.track = []
            this.distance = 0
            this.startTime = null
            this.isTracking = false
            if (this.polyline) this.polyline.setPath([])
        }
    },

    //This data will persist across page reloads
    //Dont store the polyline object
    persist: {
        storage: localStorage,
        paths: ['track', 'distance', 'isTracking', 'startTime']
    }
})