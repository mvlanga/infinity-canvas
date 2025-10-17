import { useEffect, useState } from "react";

export const useScreenSize = () => {
	const [width, setWidth] = useState<number>(
		document.documentElement.clientWidth,
	);
	const [height, setHeight] = useState<number>(
		document.documentElement.clientHeight,
	);

	useEffect(() => {
		const handleResize = () => {
			setWidth(document.documentElement.clientWidth);
			setHeight(document.documentElement.clientHeight);
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return {
		width,
		height,
	};
};
