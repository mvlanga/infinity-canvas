import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Group, Transformer } from "react-konva";
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
	selectedLayerId,
}: CanvasLayerProps & {
	selectedLayerId: null | string;
}) => {
	const groupRef = useRef<null | Konva.Group>(null);
	const transformerRef = useRef<null | Konva.Transformer>(null);

	useEffect(() => {
		if (!groupRef.current) {
			return;
		}

		groupRef.current.moveToBottom();
	}, []);

	useEffect(() => {
		if (!selectedLayerId || !groupRef.current || !transformerRef.current) {
			return;
		}

		transformerRef.current.nodes([groupRef.current]);
	}, [selectedLayerId]);

	console.log(`${id}: ${selectedLayerId === id}`);

	return (
		<>
			<Group ref={groupRef} x={x} y={y} name={id + "a"}>
				<CanvasImage
					src={src}
					width={width}
					height={height}
					scaleX={scale}
					scaleY={scale}
				/>
				{children?.map((child) => (
					<CanvasLayer
						key={child.id}
						selectedLayerId={selectedLayerId}
						{...child}
					/>
				))}
			</Group>
			<Transformer key={id + "trans"} ref={transformerRef} name={id} />
		</>
	);
};
