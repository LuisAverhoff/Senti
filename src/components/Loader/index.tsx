import React from "react";
import ContentLoader from "react-content-loader";

interface LoaderProps {
  /*
   * The height of the skeleton loader. This will be set in the viewbox attr.
   */
  height: number;
  /*
   * The width of the skeleton loader. This will be set in the viewbox attr.
   */
  width: number;
  /*
   * Background color that is used when loader is animated.
   */
  primaryColor?: string;
  /*
   * Used as the placeholder/layer of animation
   */
  secondaryColor?: string;
  /*
   * Animation speed in seconds
   */
  speed?: number;
  /*
   * TOptional style definitions. Default to an empty object
   */
  style?: React.CSSProperties;
  /*
   * This property defines the layout of the skeleton loader.
   */
  rects: Array<React.SVGProps<SVGRectElement>>;
}

const CreateSkeletonLoader: React.FunctionComponent<LoaderProps> = props => {
  const { rects, ...loaderProps } = props;

  return (
    <ContentLoader {...loaderProps}>
      {rects.map((rect, id) =>
        React.createElement("rect", { key: id, ...rect })
      )}
    </ContentLoader>
  );
};

CreateSkeletonLoader.defaultProps = {
  speed: 2,
  style: {},
  primaryColor: "#f3f3f3",
  secondaryColor: "#ecebeb"
};

export { CreateSkeletonLoader };
