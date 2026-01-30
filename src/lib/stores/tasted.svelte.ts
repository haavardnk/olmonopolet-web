let tastedStates = $state<Map<string, boolean>>(new Map());

export const tastedStore = {
	get states() {
		return tastedStates;
	},

	getTasted(productId: string): boolean | undefined {
		return tastedStates.get(productId);
	},

	setTasted(productId: string, isTasted: boolean) {
		const newMap = new Map(tastedStates);
		newMap.set(productId, isTasted);
		tastedStates = newMap;
	},

	removeTasted(productId: string) {
		const newMap = new Map(tastedStates);
		newMap.delete(productId);
		tastedStates = newMap;
	},

	clear() {
		tastedStates = new Map();
	}
};
