namespace Helpers {
    export function imageSource(category: string, file: string): string {
        return `/static/images/${category}/${file}`;
    }

    export function onHighRes(resolution: Structure.Resolution, f: (ts: number) => void): void {
        if (resolution == "High") {
            requestAnimationFrame(f);
        } else {
            f(performance.now());
        }
    }

    export function openPopup(content: string): void {
        $.magnificPopup.open({
            items: {
                src: content,
                type: "inline"
            },
            removalDelay: 300,
            mainClass: "mfp-fade"
        });
    }
}
