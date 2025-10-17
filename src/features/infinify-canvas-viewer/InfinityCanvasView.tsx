import type Konva from "konva";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import { demoLayers } from "@/data.ts";
import { CanvasLayer } from "@/features/infinify-canvas-viewer/components/CanvasLayer.tsx";
import { handleStageWheelEvent } from "@/utils/handleStageWheelEvent.ts";
import { useScreenSize } from "@/utils/useScreenSize.ts";
import {
	useScreenSizeAwareCanvasDimensions,
	useScreenSizeAwareCanvasOffset,
} from "@/utils/useScreenSizeAwareCanvasDimensions.ts";
import { useStageTouchMoveEvents } from "@/utils/useStageTouchMoveEvents.ts";

export const InfinityCanvasView = () => {
	const data = demoLayers;

	const stageRef = useRef<null | Konva.Stage>(null);

	const {
		initialWidth: initialScreenWidth,
		initialHeight: initialScreenHeight,
		width: screenWidth,
		height: screenHeight,
	} = useScreenSize();

	const { handleTouchMove, handleTouchEnd } = useStageTouchMoveEvents();

	const firstCanvasLayerDimensions = useScreenSizeAwareCanvasDimensions(
		initialScreenWidth,
		initialScreenHeight,
		data,
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
				onWheel={(e) => handleStageWheelEvent(e, stageRef)}
				onTouchMove={(e) => handleTouchMove(e, stageRef)}
				onTouchEnd={() => handleTouchEnd(stageRef)}
				onTouchCancel={handleTouchEnd}
				offset={stageOffset}
			>
				<Layer imageSmoothingEnabled={false}>
					<CanvasLayer {...data} {...firstCanvasLayerDimensions} />
				</Layer>
			</Stage>
		</main>
	);
};
