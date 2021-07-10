import useClipboard from "./../../node_modules/vue-clipboard3";

export default function useCopy() {

    const { toClipboard } = useClipboard();

    const copyFrom = (e) => {
        copy(e);
    };

    const copy = async (text) => {
        try {
            await toClipboard(text);
        } catch (e) {
            console.error(e);
        }
    };

    const copyRange = async (result) => {
        try {
            let rangeTextData = "";
            result.value.map((item) => {
                rangeTextData += item.full + "\n";
            });

            await toClipboard(rangeTextData);
        } catch (e) {
            console.error(e);
        }
    };

    return { copyFrom, copyRange, copy }
}