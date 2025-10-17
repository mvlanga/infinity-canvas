import { createFileRoute } from "@tanstack/react-router";
import type Konva from "konva";
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import type { CanvasLayerProps } from "@/components/CanvasLayer.tsx";
import { CanvasLayer } from "@/components/CanvasLayer.tsx";
import { useScreenSize } from "@/utils/useScreenSize.ts";
import {
	useScreenSizeAwareCanvasDimensions,
	useScreenSizeAwareCanvasOffset,
} from "@/utils/useScreenSizeAwareCanvasDimensions.ts";

export const Route = createFileRoute("/")({
	component: App,
});

const layers: CanvasLayerProps = {
	src: "1.png",
	width: 3583,
	height: 2406,
	x: 0,
	y: 0,
	scale: 1,
	children: [
		{
			src: "red.webp",
			width: 200,
			height: 200,
			x: 0,
			y: 0,
			scale: 1,
		},
		{
			src: "2.png",
			width: 1892,
			height: 2565,
			x: 2255,
			y: 1382,
			scale: 0.005,
			children: [
				{
					src: "3.png",
					width: 0.25,
					height: 0.25,
					x: 6.9,
					y: 5.4,
					scale: 1,
				},
			],
		},
	],
};

function App() {
	const stageRef = useRef<null | Konva.Stage>(null);

	const {
		initialWidth: initialScreenWidth,
		initialHeight: initialScreenHeight,
		width: screenWidth,
		height: screenHeight,
	} = useScreenSize();

	const [lastDist, setLastDist] = useState<number | null>(null);
	const [lastCenter, setLastCenter] = useState<{ x: number; y: number } | null>(
		null,
	);

	const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();
		const stage = stageRef.current;
		if (!stage) return;

		const scaleBy = 1.1;
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		const mousePointTo = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		const direction = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
		const newScale = oldScale * direction;
		if (newScale < 0.1) return;

		const newPos = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		};

		stage.scale({ x: newScale, y: newScale });
		stage.position(newPos);
		stage.batchDraw();
	};

	const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
		const stage = stageRef.current;
		if (!stage) return;

		const touch1 = e.evt.touches[0];
		const touch2 = e.evt.touches[1];

		if (touch1 && touch2) {
			e.evt.preventDefault();

			stage.draggable(false);

			const p1 = { x: touch1.clientX, y: touch1.clientY };
			const p2 = { x: touch2.clientX, y: touch2.clientY };

			const center = {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2,
			};

			const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

			if (!lastDist || !lastCenter) {
				setLastDist(dist);
				setLastCenter(center);
				return;
			}

			const oldScale = stage.scaleX();
			const scaleBy = dist / lastDist;
			const newScale = oldScale * scaleBy;
			if (newScale < 0.1) return;

			const stagePos = stage.position();

			const pointTo = {
				x: (lastCenter.x - stagePos.x) / oldScale,
				y: (lastCenter.y - stagePos.y) / oldScale,
			};

			const newPos = {
				x: center.x - pointTo.x * newScale,
				y: center.y - pointTo.y * newScale,
			};

			stage.scale({ x: newScale, y: newScale });
			stage.position(newPos);
			stage.batchDraw();

			setLastDist(dist);
			setLastCenter(center);
		} else {
			stage.draggable(true);
		}
	};

	const handleTouchEnd = () => {
		setLastDist(null);
		setLastCenter(null);
		const stage = stageRef.current;
		if (stage) stage.draggable(true); // re-enable drag
	};

	const firstCanvasLayer = layers;

	const firstCanvasLayerDimensions = useScreenSizeAwareCanvasDimensions(
		initialScreenWidth,
		initialScreenHeight,
		firstCanvasLayer,
	);

	const stageOffset = useScreenSizeAwareCanvasOffset(
		initialScreenWidth,
		initialScreenHeight,
		firstCanvasLayerDimensions,
	);

	return (
		<main>
			<Stage
				ref={stageRef}
				width={screenWidth}
				height={screenHeight}
				draggable
				onWheel={handleWheel}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
				offset={stageOffset}
			>
				<Layer imageSmoothingEnabled={false}>
					<CanvasLayer
						key={firstCanvasLayer.src}
						{...firstCanvasLayer}
						{...firstCanvasLayerDimensions}
					/>
				</Layer>
			</Stage>
		</main>
	);
}
