import React from "react"
import ContentLoader from "react-content-loader"

interface LoaderProps {
  /*
   * The height of the skeleton loader. This will be set in the viewbox attr.
   */
  height: number | undefined
  /*
   * The width of the skeleton loader. This will be set in the viewbox attr.
   */
  width: number | undefined
  /*
   * Background color that is used when loader is animated.
   */
  primaryColor?: string
  /*
   * Used as the placeholder/layer of animation
   */
  secondaryColor?: string
  /*
   * Animation speed in seconds
   */
  speed?: number
  /*
   * Optional style definitions. Defaults to an empty object
   */
  style?: React.CSSProperties
  /*
   * This property defines the layout of the skeleton loader. For each element that you
   * add, make sure to specify the type i.e {type: "rect", ...} so that it knows what it is
   * rendering. If you don't, the element wont be rendered and it will move on to the next element.
   * Of course, you still have to make sure that the properties you give it matches the type you
   * specified i.e property cx is only for elements of type circle.
   */
  skeleton: Array<React.SVGProps<any>>
}

const CreateSkeletonLoader: React.FunctionComponent<LoaderProps> = props => {
  const { skeleton, ...loaderProps } = props

  return (
    <ContentLoader {...loaderProps}>
      {skeleton.map(({ type, ...props }, id) =>
        type ? React.createElement(type, { key: id, ...props }) : null
      )}
    </ContentLoader>
  )
}

CreateSkeletonLoader.defaultProps = {
  width: 640,
  height: 480,
  speed: 2,
  style: {},
  primaryColor: "#dadada",
  secondaryColor: "#ecebeb"
}

export default CreateSkeletonLoader
