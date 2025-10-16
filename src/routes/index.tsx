import { createFileRoute } from "@tanstack/react-router";
import type Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

export const Route = createFileRoute("/")({
	component: App,
});

const URLImage = ({ src, ...rest }: { src: string } & Konva.NodeConfig) => {
	const [image] = useImage(src, "anonymous");
	return <Image image={image} {...rest} />;
};

function App() {
	const stageRef = useRef<null | Konva.Stage>(null);

	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setSize({
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

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
		if (newScale < 0.2) return;

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
			if (newScale < 0.2) return;

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

	return (
		<Stage
			ref={stageRef}
			width={size.width}
			height={size.height}
			draggable
			onWheel={handleWheel}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchEnd}
		>
			<Layer imageSmoothingEnabled={false}>
				<URLImage src="1.png" />
				<URLImage
					src="2.png"
					x={2255}
					y={1382}
					scale={{ x: 0.005, y: 0.005 }}
				/>
			</Layer>
		</Stage>
	);
}
