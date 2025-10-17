import type { CanvasLayerProps } from "@/features/infinity-canvas-editor/components/CanvasLayer.tsx";

export const demoLayers: CanvasLayerProps = {
	id: "first",
	src: "1.png",
	width: 3583,
	height: 2406,
	x: 0,
	y: 0,
	scale: 1,
	children: [
		{
			id: "second",
			src: "red.webp",
			width: 200,
			height: 200,
			x: 0,
			y: 0,
			scale: 1,
		},
		/*{
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
        },*/
	],
};
