// bold.ts

const bold4unity2html = {
  pattern: new RegExp("<b>(.*?)</b>"),
  replace: (match, p1) => {
    return `<strong>${p1}</strong>`;
  },
};

const bold4html2unity = {
  pattern: new RegExp("<strong>(.*?)</strong>"),
  replace: (match, p1) => {
    return `<b>${p1}</b>`;
  },
};

const boldconverter = {
  html2unity: bold4html2unity,
  unity2html: bold4unity2html,
};

// fontsize.ts

const decReg = new RegExp("[1-9]{1}[0-9]*");

const fontsize4unity2html = {
  pattern: new RegExp("<size=([^>]*)>(.*?)</size>"),
  replace: (match, p1, p2) => {
    if (!p1.match(decReg)) {
      throw new Error(`error font size : ${match}`);
    }

    return `<span style="font-size: ${p1}px">${p2}</span>`;
  },
};

const fontsize4html2unity = {
  pattern: new RegExp(
    '<span style="font-size: *([^>"]*)px">(.*?(?!<span).*?)</span>',
  ),
  replace: (match, p1, p2) => {
    if (!p1.match(decReg)) {
      throw new Error(`error font size : ${match}`);
    }

    return `<size=${p1}>${p2}</size>`;
  },
};

const fontsizeconverter = {
  html2unity: fontsize4html2unity,
  unity2html: fontsize4unity2html,
};

// italic.ts

const italic4unity2html = {
  pattern: new RegExp("<i>(.*?)</i>"),
  replace: (match, p1) => {
    return `<em>${p1}</em>`;
  },
};

const italic4html2unity = {
  pattern: new RegExp("<em>(.*?)</em>"),
  replace: (match, p1) => {
    return `<i>${p1}</i>`;
  },
};

const italicconverter = {
  html2unity: italic4html2unity,
  unity2html: italic4unity2html,
};

// textcolor.ts

/**
 * Unity colors
 * @type Array<{name: string, color: string}>
 */
const colors = [
  { name: "aqua", color: "#00ffff" },
  { name: "black", color: "#000000" },
  { name: "blue", color: "#0000ff" },
  { name: "brown", color: "#a52a2a" },
  { name: "cyan", color: "#00ffff" },
  { name: "darkblue", color: "#0000a0" },
  { name: "fuchsia", color: "#ff00ff" },
  { name: "green", color: "#008000" },
  { name: "grey", color: "#808080" },
  { name: "lightblue", color: "#add8e6" },
  { name: "lime", color: "#00ff00" },
  { name: "magenta", color: "#ff00ff" },
  { name: "maroon", color: "#800000" },
  { name: "navy", color: "#000080" },
  { name: "olive", color: "#808000" },
  { name: "orange", color: "#ffa500" },
  { name: "purple", color: "#800080" },
  { name: "red", color: "#ff0000" },
  { name: "silver", color: "#c0c0c0" },
  { name: "teal", color: "#008080" },
  { name: "white", color: "#ffffff" },
  { name: "yellow", color: "#ffff00" },
];

const color4unity2html = {
  // From what I remember, this regex pattern was created using AI for the most part
  pattern: new RegExp(
    "(?:<color=(?<Color>[^>]*)>|<(?<Color>#[a-fA-F0-9]{3,8})>)(?<Content>.*?)(?=</color>|<color=[^>]*>|<#[a-fA-F0-9]{3,8}>|$)",
  ),
  replace: (match, ...args) => {
    let { Color, Content } = args.pop();

    Color = Color.replaceAll('"', "");

    let hex = true;

    if (!Color) {
      console.error(`error color code or color name : ${match}`);
      return "Error!";
    }

    if (!Color.match(new RegExp("#[a-fA-F0-9]{3,8}"))) {
      hex = false;
    }

    const color = colors.find((v) => v.name === Color);

    if (!color && !hex) {
      console.error(`error color code or color name : ${match}`);
      return "Error!";
    }

    return `<span class="inheritParent" style="color: ${
      color ? color.color : Color.toLowerCase()
    }">${Content}</span>`;
  },
};

const color4html2unity = {
  pattern: new RegExp(
    '<span style="color: *([^>"]*)">(.*?(?!<span).*?)</span>',
  ),
  replace: (match, p1, p2) => {
    if (!p1.match(new RegExp("#[a-fA-F0-9]{3,8}"))) {
      throw new Error(`error color code : ${match}`);
    }

    return `<color=${p1.toLowerCase()}ff>${p2}</color>`;
  },
};

const textcolorconverter = {
  html2unity: color4html2unity,
  unity2html: color4unity2html,
};

// paragraphconverter.ts

class ParagraphConverter {
  html2unity(input) {
    return this.convert(input, "<p>(.*?)</p>", this.html2unityfill, "\n");
  }

  unity2html(input) {
    return this.convert(input, "(.*)", this.unity2htmlfill, "");
  }

  convert(input, pattern, fill, separator) {
    const matcharray =
      pattern !== "(.*)"
        ? input.match(new RegExp(pattern, "g"))
        : input.split("\n");
    if (!matcharray) {
      throw new Error(`error no paragraph in html input ${input}`);
    }
    const output = matcharray
      .map((item) => {
        const regexp = new RegExp(pattern);
        const regExpMatchArray = item.match(regexp);
        if (!regExpMatchArray) {
          throw new Error(`error invalid paragraph in ${item}`);
        }
        return fill(regExpMatchArray);
      })
      .join(separator);

    return output;
  }

  html2unityfill(r) {
    const paragraph = r[1];
    return `${paragraph}`;
  }

  unity2htmlfill(r) {
    const paragraph = r[1];
    return `${paragraph}`;
  }
}

// linearconverter.ts

class LinearConverter {
  constructor() {
    this.converters = [boldconverter, italicconverter];
  }

  html2unity(input) {
    return this.convert(input, (c) => c.html2unity);
  }

  unity2html(input) {
    return this.convert(input, (c) => c.unity2html);
  }

  convert(input, parse) {
    this.converters.forEach((converter) => {
      const parser = parse(converter);
      while (input.match(parser.pattern)) {
        input = input.replace(parser.pattern, parser.replace);
      }
    });
    return input;
  }
}

// nestedconverter.ts

class NestedConverter {
  constructor() {
    this.converters = [fontsizeconverter, textcolorconverter];
  }

  html2unity(input) {
    return this.convert(input, (c) => c.html2unity);
  }

  unity2html(input) {
    return this.convert(input, (c) => c.unity2html);
  }

  convert(input, parse) {
    while (true) {
      let ismatch = false;
      this.converters.forEach((converter) => {
        const parser = parse(converter);
        while (input.match(parser.pattern)) {
          input = input.replace(parser.pattern, parser.replace);
          ismatch = true;
        }
      });

      if (ismatch === false) {
        break;
      }
    }

    return input;
  }
}

// index.ts

export class Converter {
  constructor(options) {
    this.converters = [
      new LinearConverter(),
      new NestedConverter(),
      new ParagraphConverter(),
    ];
    this.options = options;
  }

  html2unity(input) {
    return this.convert(input, (c, i) => c.html2unity(i));
  }

  unity2html(input) {
    return this.convert(input, (c, i) => c.unity2html(i));
  }

  convert(input, func) {
    this.verityinput(input);
    this.converters.forEach((converter) => {
      input = func(converter, input);
    });
    return input;
  }

  static removeRichText(input) {
    input = input.replaceAll(/<.*?>/g, "");
    return input;
  }

  verityinput(input) {
    if (input === undefined || input === null) {
      throw new Error(`input is undefined or null: ${input}`);
    }

    if (typeof input !== "string") {
      throw new Error(`input is not string type: ${input}`);
    }
  }
}
