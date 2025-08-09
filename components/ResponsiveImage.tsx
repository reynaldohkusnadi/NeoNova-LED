import Image, { ImageProps } from "next/image";

interface ResponsiveImageProps extends Omit<ImageProps, "sizes"> {
  /**
   * Default responsive sizes to avoid CLS and oversized images.
   * - Mobile: 100vw
   * - Sm+: 50vw for typical split layouts
   */
  sizes?: string;
}

export function ResponsiveImage({ sizes, ...rest }: ResponsiveImageProps) {
  const defaultSizes = sizes ?? "(max-width: 640px) 100vw, 50vw";
  return <Image sizes={defaultSizes} {...rest} alt={rest.alt ?? ""} />;
}
