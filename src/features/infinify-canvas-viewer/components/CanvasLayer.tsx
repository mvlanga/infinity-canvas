import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Group } from "react-konva";
import { CanvasImage } from "@/components/CanvasImage.tsx";

export type CanvasLayerProps = {
	id: string;
	src: string;
	width: number;
	height: number;
	x: number;
	y: number;
	scale: number;
	children?: CanvasLayerProps[];
};

export const CanvasLayer = ({
	id,
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
		<Group name={id} ref={groupRef} x={x} y={y}>
			<CanvasImage
				src={src}
				width={width}
				height={height}
				scaleX={scale}
				scaleY={scale}
			/>
			{children?.map((child) => (
				<CanvasLayer key={child.id} {...child} />
			))}
		</Group>
	);
};
