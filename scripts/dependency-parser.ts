///<reference path="../typings/index.d.ts"/>

const fs = require("fs");

import * as cheerio from "cheerio";

interface Template {
    filename: string;
    path: string;
}

interface Directive {
    filename?: string; // TODO
    path: string;
    name: string;
}

interface Dependency {
    type: "attribute"|"element";
    name: string;
}

interface Component {
    deps: Dependency[];
    name: string;
    directiveName?: string;
    templates?: Template[];
    directives?: Directive[]|void;
}

interface DirectiveName {
    camel: string;
    snake: string;
}

let components: Component[] = [];

let directiveNames: string[] = [];

const xuiComponentsPath = "/home/itsv/WebstormProjects/Xui/ng1/src/components";

const dirList: string[] = fs.readdirSync(xuiComponentsPath);

const getMatches = (string, regex, index = 1) => {
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

dirList.forEach(dir => {
    const path = `${xuiComponentsPath}/${dir}`;
    if (fs.lstatSync(path).isDirectory()) {
        let componentFiles = fs.readdirSync(path);
        let templates = componentFiles.filter((filename: string) => filename.endsWith(".html"));
        let directives = componentFiles.filter((filename: string) => filename.endsWith("directive.ts"));
        let component: Component = {
            name: dir,
            deps: []
        };

        if (templates[0]) {
            component.templates = templates.map(t => {
                return {
                    filename: t,
                    path: path
                }
            });
        }

        const getDirectives = (path: string): Directive[]|void => {
            const dir = fs.readFileSync(`${path}/index.ts`, "utf8");
            const re = /\.component\("(\w*)"/g;

            const names = getMatches(dir, re);

            if (names[0]) {
                directiveNames = directiveNames.concat(names);
                return names.map(n => {
                    return {
                        name: n,
                        path: path
                    }
                });
            }

        };

        component.directives = getDirectives(path);

        components.push(component);
    }
});

const snakeCase = (name, separator = "-") => {
    const normalizeRegexp = /[A-Z]/g;
    return name.replace(normalizeRegexp, (letter, pos) => (pos ? separator : '') + letter.toLowerCase());
}

const directiveNamesFull: DirectiveName[] = directiveNames.map((name: string) => {
    return {
        snake: snakeCase(name),
        camel: name
    }
});

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

components.forEach((component: Component) => {
    if (component.templates) {
        component.templates.forEach((t: Template) => {
            const template = fs.readFileSync(`${t.path}/${t.filename}`, 'utf8');

            let $ = cheerio.load(template);

            directiveNamesFull.forEach((name: DirectiveName) => {
                // skipping if we already know about this dep
                if (component.deps.find((d: Dependency) => d.name === name.camel)) return;
                if ($(name.snake).length) {
                    component.deps.push({
                        type: "element",
                        name: name.camel
                    });
                }

                if ($(`[${name.snake}]`).length) {
                    component.deps.push({
                        type: "attribute",
                        name: name.camel
                    });
                }
            })
        })
    }

    if (component.directives) {
        const dirNameEnding = capitalizeFirstLetter(component.name);
        const foundDir = (<Array<Directive>>component.directives).find((dir: Directive) => dir.name.endsWith(dirNameEnding));
        if (foundDir) {
            component.directiveName = foundDir.name;
        } else {
            console.error(`Something wrong with ${component.name}`)
        }
    }

})

// populating final JSON

fs.writeFileSync(`${__dirname}/deps.json`, JSON.stringify(components, null, 2));

// preparing data for D3
// we want this:
//
// {
//     "nodes": [
//     {"id": "Myriel", "group": 1}
// ],
//     "links": [
//     {"source": "Napoleon", "target": "Myriel", "value": 1},
//     {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8}
// ]
// }

let d3Deps = {
    nodes: [

    ],
    links: [

    ]
};

const truncateXui = (name: string): string => {
    return name.startsWith("xui") ? name.substring(3) : name;
}

components.forEach((component) => {
    d3Deps.nodes = d3Deps.nodes.concat((<Array<Directive>>component.directives).map((directive: Directive) => {
        return {
            id: truncateXui(directive.name),
            visible: true
        }
    }));
    if (component.directiveName) {
        d3Deps.links = d3Deps.links.concat((<Array<Dependency>>component.deps).map((dep: Dependency) => {
            return {
                source: truncateXui(component.directiveName),
                target: truncateXui(dep.name),
                type: dep.type
            }
        }));
    }
});

fs.writeFileSync(`${__dirname}/deps-d3.json`, JSON.stringify(d3Deps, null, 2));
