<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { FoodTruck } from '~/types'

const props = defineProps<{ trucks: FoodTruck[] }>()
const emit = defineEmits<{ select: [truck: FoodTruck] }>()

const config = useRuntimeConfig()
const mapEl = ref<HTMLDivElement | null>(null)
let map: mapboxgl.Map | null = null
const markers: mapboxgl.Marker[] = []

function clearMarkers() {
  markers.forEach(m => m.remove())
  markers.length = 0
}

function renderMarkers() {
  if (!map) return
  clearMarkers()
  props.trucks.forEach((truck, i) => {
    const el = document.createElement('div')
    el.className = 'flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white shadow cursor-pointer'
    el.textContent = String(i + 1)
    el.addEventListener('click', () => emit('select', truck))
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([truck.longitude, truck.latitude])
      .addTo(map!)
    markers.push(marker)
  })
}

onMounted(() => {
  mapboxgl.accessToken = config.public.mapboxToken
  map = new mapboxgl.Map({
    container: mapEl.value!,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: props.trucks[0] ? [props.trucks[0].longitude, props.trucks[0].latitude] : [-122.4194, 37.7749],
    zoom: 13
  })
  map.on('load', renderMarkers)
})

watch(() => props.trucks, renderMarkers)

onBeforeUnmount(() => {
  clearMarkers()
  map?.remove()
})
</script>

<template>
  <div ref="mapEl" class="flex-1 w-full" />
</template>
