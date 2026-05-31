import { State } from "../cli/state.js";
import { saveConfig } from "../utils/configStore.js";

export async function commandClear(state: State): Promise<void> {
    if (Object.keys(state.summaryList).length === 0) {
        console.log("Summary list is already empty.");
        return;
    }

    state.summaryList = {};
    state.summaryOrder = [];
    saveConfig({ units: state.units, summaryList: {}, summaryOrder: [] });
    console.log("Summary list cleared.");
}
