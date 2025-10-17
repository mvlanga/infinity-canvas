import type Konva from "konva";
import type { RefObject } from "react";
import { MIN_SCROLL_VALUE } from "@/utils/constants.ts";

export const handleStageWheelEvent = (
	e: Konva.KonvaEventObject<WheelEvent>,
	stageRef: RefObject<null | Konva.Stage>,
) => {
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
	if (newScale < MIN_SCROLL_VALUE) return;

	const newPos = {
		x: pointer.x - mousePointTo.x * newScale,
		y: pointer.y - mousePointTo.y * newScale,
	};

	stage.scale({ x: newScale, y: newScale });
	stage.position(newPos);
	stage.batchDraw();
};
