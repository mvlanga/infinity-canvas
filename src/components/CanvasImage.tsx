import type Konva from "konva";
import { Image } from "react-konva";
import useImage from "use-image";

export const CanvasImage = ({
	src,
	...rest
}: { src: string } & Konva.NodeConfig) => {
	const [image] = useImage(src, "anonymous");
	return <Image image={image} {...rest} />;
};
