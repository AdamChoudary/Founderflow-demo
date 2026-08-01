/**
 * SVG filter that gives the CSS canopy layer an organic edge.
 *
 * Radial gradients alone read as smooth blobs, which looks like a gradient
 * rather than tree cover. Displacing them with fractal noise chews the edges
 * into foliage-shaped silhouettes. Rendered once at the top of the page and
 * referenced by `.atmos-canopy` via filter: url(#canopy-warp).
 *
 * The wide/tall baseFrequency ratio stretches the noise horizontally, which
 * reads as branches rather than clouds.
 */
export default function AtmosphereDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        <filter
          id="canopy-warp"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.017"
            numOctaves="4"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
