/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='op_switch.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

interface IAppState {
  tab?: string,
  op: string,
  tags: Array<string>,
}

$(() => {
  let svg = Snap("#impactcanvas");
  let [width, height] = [$(window).width(),
                         $(window).height() - $("#impactcanvas").offset().top];

  svg.attr({width: width, height: height});

  let people = new People(width, height);

  $("select.tags").selectivity({placeholder: "Choose one or more topics..."});

  new OpSwitch(Snap("#opcanvas"), ["or", "and"]).draw((_:OpSwitchState, t:string) => {
    $("#op").val(t.toUpperCase()).change();
  });

  new OpSwitch(Snap("#switchcanvas"), ["IMPACT", "TIMELINE"], 200, 220, 80).draw((s:OpSwitchState, _:string) => {
    console.log(s);
  });

  window.addEventListener("popstate", setState);
  window.addEventListener("load", setState);

  function setState() : void {
    let state : IAppState | boolean = history.state || stateFromPath();

    if (typeof state !== "boolean") {
      executeState(state);
    }
  }

  function stateFromPath() : IAppState | boolean {
    let isValid = /^\/(impact|timeline)\/(and|or)\/([\w\-\+]+)$/;
    let groups = isValid.exec(document.location.pathname);

    if (groups) {
      return {tab: groups[1],
              op: groups[2],
              tags: groups[3].split("+")};
    } else {
      return false;
    }
  }

  function executeState(s:IAppState) : void {
    // Execute: <tab>(op, tags);
    // Ensure correct state in OpSwitchs and tags dropdown.
    console.log(s);
  }

  $("div.tags, #op").change((e:any) => {
    let state = {tab: "impact",
                 op: $("#op").val(),
                 tags: $("select.tags").selectivity("value")};

    e.preventDefault();
    writeState(state);
    impact(state);
  });

  function impact(state:IAppState) : void {
    $.getJSON("/people", state,
      (d:{people:Array<IPerson>}) => {
        let [w, h] = ["width", "height"].map((a) => parseInt(svg.attr(a)));

        people.clear();

        for (let p of d.people) {
          let [x, y] = [Math.random() * w, Math.random() * h];

          people.push(new Person(svg, p, new Vector(x, y)));
        }

        svg.clear();
        people.pack();
      }
    );
  }

  function timeline() : void {
    // TODO: Implement.
  }

  function writeState(state:IAppState) : void {
    history.pushState(state, null, `/${state.tab}/${state.op.toLowerCase()}/${state.tags.join("+")}`);
  }
});
