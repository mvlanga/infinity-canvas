import {useMemo} from "react";

export const getFitDirection = (width: number, height: number) =>
	useMemo(() => width / height > 1 ? "horizontal" : "vertical", [width, height])
