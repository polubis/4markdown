import { Button } from "design-system/button";
import React from "react";
import { trackEvent } from "../core/analytics";

const resetAll = (): void => {
	localStorage.clear();
	sessionStorage.clear();
	window.location.reload();
};

const ExceptionScreen = () => {
	React.useEffect(() => {
		trackEvent(`exception_occured`);
	}, []);

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="p-4 flex flex-col items-center max-w-[280px]">
				<h6 className="text-xl text-center">
					Your session expired. Please click button below.
				</h6>
				<Button
					title="Restart application"
					className="mt-4"
					auto
					s={2}
					i={2}
					onClick={resetAll}
				>
					Restart
				</Button>
			</div>
		</div>
	);
};

export { ExceptionScreen };
