type YourAccountDto = {
	balance: {
		tokens: number;
		refillStatus: "initialized" | "refilled" | "not-refilled";
	};
	trusted: boolean;
};

export type { YourAccountDto };
