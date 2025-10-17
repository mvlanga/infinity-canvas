import type Konva from "konva";
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { demoLayers } from "@/data.ts";
import {
	CanvasLayer,
	type CanvasLayerProps,
} from "@/features/infinity-canvas-editor/components/CanvasLayer.tsx";
import { cn } from "@/utils/cn.ts";
import { handleStageWheelEvent } from "@/utils/handleStageWheelEvent.ts";
import { useScreenSize } from "@/utils/useScreenSize.ts";
import { useStageTouchMoveEvents } from "@/utils/useStageTouchMoveEvents.ts";

export const InfinityCanvasEdit = () => {
	const data = demoLayers;

	const stageRef = useRef<null | Konva.Stage>(null);

	const { width: screenWidth, height: screenHeight } = useScreenSize();

	const { handleTouchMove, handleTouchEnd } = useStageTouchMoveEvents();

	const [selectedLayerId, setSelectedLayerId] = useState<null | string>(null);

	return (
		<>
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
				>
					<Layer imageSmoothingEnabled={false}>
						<CanvasLayer selectedLayerId={selectedLayerId} {...data} />
					</Layer>
				</Stage>
			</main>
			<aside className="fixed top-0 right-0 bg-white h-full border-l p-2">
				<ul>
					<button type="button" onClick={() => setSelectedLayerId(null)}>
						None
					</button>
					{extractIds(data).map((layerId) => (
						<li key={layerId}>
							<button
								type="button"
								onClick={() => setSelectedLayerId(layerId)}
								className={cn(selectedLayerId === layerId && "text-red-500")}
							>
								{layerId}
							</button>
						</li>
					))}
				</ul>
			</aside>
		</>
	);
};

function extractIds(layer: CanvasLayerProps): string[] {
	const ids = [layer.id];

	if (layer.children) {
		for (const child of layer.children) {
			ids.push(...extractIds(child));
		}
	}

	return ids;
}
