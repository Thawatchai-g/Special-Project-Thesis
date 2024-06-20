import React from 'react'
import { LayersControl, TileLayer } from 'react-leaflet'

const BaseMap = () => {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer name='ภูมิประเทศ' checked>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name='ดาวเทียม'>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}

export default BaseMap
