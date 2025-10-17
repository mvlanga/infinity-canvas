import type Konva from "konva";
import { type RefObject, useCallback, useState } from "react";
import { MIN_SCROLL_VALUE } from "@/utils/constants.ts";

export const useStageTouchMoveEvents = () => {
	const [lastDist, setLastDist] = useState<number | null>(null);
	const [lastCenter, setLastCenter] = useState<{ x: number; y: number } | null>(
		null,
	);

	const handleTouchMove = useCallback(
		(
			e: Konva.KonvaEventObject<TouchEvent>,
			stageRef: RefObject<null | Konva.Stage>,
		) => {
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
				if (newScale < MIN_SCROLL_VALUE) return;

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
		},
		[lastCenter, lastDist],
	);

	const handleTouchEnd = useCallback(
		(stageRef: RefObject<null | Konva.Stage>) => {
			setLastDist(null);
			setLastCenter(null);
			const stage = stageRef.current;
			if (stage) stage.draggable(true); // re-enable drag
		},
		[],
	);

	return {
		handleTouchMove,
		handleTouchEnd,
	};
};
