/// <reference path='person.ts'/>
/// <reference path='people.ts'/>
/// <reference path='vector.ts'/>
/// <reference path='op_switch.ts'/>
/// <reference path='d/snapsvg.d.ts'/>

declare var $:any;

$(() => {
  let svg_i = Snap("#impactcanvas");

  svg_i.attr({width: $(window).width() - 20,
            height: $(window).height() - $("#impactcanvas").offset().top + 7});

  let people = new People(svg_i);

  $("#tags").selectivity({placeholder: "Choose one or more topics"});

  let op_switch = new OpSwitch(Snap("#opcanvas"));
  op_switch.draw((s:string) => {
    $("#op").val(s).change();
  });

  $("#tags, #op").change((e:any) => {
    e.preventDefault();

    $.getJSON("/people", $("#search").serialize(),
      (d:{people:Array<IPerson>}) => {
        if (people.length > 0) {
          people.alive = false;
          people = new People(svg_i);
        }

        for (let p of d.people) {
          let x = Math.random() * parseInt(svg_i.attr("width"));
          let y = Math.random() * parseInt(svg_i.attr("height"));

          people.push(new Person(p, new Vector(x, y)));
        }

        svg_i.clear();
        people.pack();
      }
    );
  });
});
