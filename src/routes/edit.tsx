import { createFileRoute } from "@tanstack/react-router";
import { InfinityCanvasEdit } from "@/features/infinity-canvas-editor/InfinityCanvasEdit.tsx";

export const Route = createFileRoute("/edit")({
	component: InfinityCanvasEdit,
});
