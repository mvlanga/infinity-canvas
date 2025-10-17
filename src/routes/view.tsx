import { createFileRoute } from "@tanstack/react-router";
import { InfinityCanvasView } from "@/features/infinify-canvas-viewer/InfinityCanvasView.tsx";

export const Route = createFileRoute("/view")({
	component: InfinityCanvasView,
});
