import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Group } from "react-konva";
import { CanvasImage } from "@/components/CanvasImage.tsx";

export type CanvasLayerProps = {
	src: string;
	width: number;
	height: number;
	x: number;
	y: number;
	scale: number;
	children?: CanvasLayerProps[];
};

export const CanvasLayer = ({
	src,
	width,
	height,
	x,
	y,
	scale,
	children,
}: CanvasLayerProps) => {
	const groupRef = useRef<null | Konva.Group>(null);

	useEffect(() => {
		if (!groupRef.current) {
			return;
		}

		groupRef.current.moveToBottom();
	}, []);

	return (
		<Group ref={groupRef} x={x} y={y}>
			<CanvasImage
				src={src}
				width={width}
				height={height}
				scaleX={scale}
				scaleY={scale}
			/>
			{children?.map((child) => (
				<CanvasLayer key={child.src} {...child} />
			))}
		</Group>
	);
};
