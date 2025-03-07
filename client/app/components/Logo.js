import React from 'react';
import Svg, { G, Path, Text, TSpan, Polygon } from 'react-native-svg';

export default function Logo({ width = 200, height = 200 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 500 500">
      <G id="BACKGROUND">
        <Polygon 
          fill="#FFFFFF" 
          points="250,0 0,0 0,250 0,500 250,500 500,500 500,250 500,0"
        />
      </G>
      <G id="OBJECTS">
        {/* Chef hat and face paths */}
        <Path
          fill="#DE9739"
          d="M147.031,171.988c36.679,0,66.595-29.916,66.595-66.596 c0-36.68-29.916-66.596-66.595-66.596c-36.68,0-66.597,29.916-66.597,66.596C80.435,142.071,110.352,171.988,147.031,171.988z"
        />
        {/* Add other paths from the SVG */}
      </G>
      <G>
        <Text
          fill="#DE9739"
          fontFamily="OpenSans-Extrabold"
          fontSize="31"
          x="44.7446"
          y="212.9512"
        >
          CHEF LOGO
        </Text>
        <Text
          fill="#581200"
          fontFamily="OpenSans"
          fontSize="13"
          x="101.8862"
          y="226.4297"
        >
          your tagline
        </Text>
      </G>
    </Svg>
  );
} 