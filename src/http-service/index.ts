import {
    apply,
    mergeWith,
    move,
    Rule,
    SchematicContext, SchematicsException,
    template,
    Tree,
    url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';


function buildDefaultPath(project: any) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project['projectType'] === 'application' ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}

export function httpService(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const workspaceConfigBuffer = tree.read('angular.json');
        if (!workspaceConfigBuffer) {
            throw new SchematicsException('Not an Angular CLI workspace! The angular.json file is missing');
        }

        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
        const projectName = _options.project || workspaceConfig.defaultProject;
        const project = workspaceConfig.projects[projectName];

        const defaultProjectPath = buildDefaultPath(project);
        const parsedPath = parseName(defaultProjectPath, _options.name);
        const {name, path} = parsedPath;

        const templateSource = apply(
            url('./files'),
            [
                template({
                    ..._options,
                    classify: strings.classify,
                    dasherize: strings.dasherize,
                    name,
                }),
                move(path),
            ],
        );

        return mergeWith(templateSource)(tree, _context)
    };
}
