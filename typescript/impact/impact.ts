namespace Impact {
    export class Impact implements Structure.Tab {
        public people: Impact.People;
        public svg: Snap.Paper;

        public execute(state: Structure.AppState): boolean {
            $.getJSON("/people", state, (d: {people:Array<Structure.Person>}) => {
                let [w, h] = ["width", "height"].map(a => parseInt(this.svg.attr(a)));

                this.people.clear();

                for (let p of d.people) {
                    this.people.push(new Impact.Person(this.svg, p, Vector.randomized(w, h)));
                }

                this.svg.clear();

                if (this.people.length > 0) {
                    this.people.pack();
                    return true;
                } else {
                    return false;
                }
            });
        }

        public focus(): void {
        }

        public unfocus(): void {
        }

        public resize(): void {
            let [width, height] = [$(window).width(), $(window).height() - $("#impactcanvas").offset().top];

            this.people.centerize(width, height);
            this.svg.attr({width: width, height: height});
        }
    }
}
