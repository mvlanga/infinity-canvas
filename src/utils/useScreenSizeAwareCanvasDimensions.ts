import type { CanvasLayerProps } from "@/components/CanvasLayer.tsx";
import { getFitDirection } from "@/utils/common.ts";

export const useScreenSizeAwareCanvasDimensions = (
	initialScreenWidth: number,
	initialScreenHeight: number,
	firstCanvasLayer: CanvasLayerProps,
) => {
	const fitDirection = getFitDirection(initialScreenWidth, initialScreenHeight);

	let firstCanvasLayerDimensions: { width: number; height: number };

	if (fitDirection === "horizontal") {
		firstCanvasLayerDimensions = {
			width: initialScreenWidth,
			height:
				(initialScreenWidth * firstCanvasLayer.height) / firstCanvasLayer.width,
		};
	} else {
		firstCanvasLayerDimensions = {
			width:
				(initialScreenHeight * firstCanvasLayer.width) /
				firstCanvasLayer.height,
			height: initialScreenHeight,
		};
	}

	return firstCanvasLayerDimensions;
};

export const useScreenSizeAwareCanvasOffset = (
	initialScreenWidth: number,
	initialScreenHeight: number,
	firstCanvasLayerDimensions: { width: number; height: number },
) => {
	const fitDirection = getFitDirection(initialScreenWidth, initialScreenHeight);

	let stageOffset: { x: number; y: number };

	if (fitDirection === "horizontal") {
		stageOffset = {
			x: 0,
			y: (firstCanvasLayerDimensions.height - initialScreenHeight) / 2,
		};
	} else {
		stageOffset = {
			x: (firstCanvasLayerDimensions.width - initialScreenWidth) / 2,
			y: 0,
		};
	}

	return stageOffset;
};
