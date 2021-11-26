import {
    Rule,
    SchematicContext, SchematicsException,
    Tree,
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import * as ts from 'typescript';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { findMethodNode, findServiceClassNode, getLastPosition } from './ast-utils/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

function buildDefaultPath(project: any) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project['projectType'] === 'application' ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}

export function addHttpCall(_options: any): Rule {
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

        const filePath = `${path}/${name.toLowerCase()}.http-service.ts`;


        const content = tree.read(filePath);
        if (!content) {
            throw new SchematicsException(`File ${filePath} does not exist.`);
        }

        const sourceText = content.toString('utf-8');
        const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

        const nodes = getSourceNodes(sourceFile);

        const serviceClassNode = findServiceClassNode(nodes[0]);
        if (!serviceClassNode) {
            throw new SchematicsException(`Did not find a service class node`);

        }
        const methodName = 'getById';
        const methodNode = findMethodNode(serviceClassNode, methodName);
        if (!methodNode) {
            throw new SchematicsException(`Did not find the ${methodName}`);
        }

        const lastPositionOfMethod = getLastPosition(methodNode);
        const methodToAdd = 'public newMethod(): void { console.log(\'yeahh\'); }';

        const methodAddChange = new InsertChange(filePath, lastPositionOfMethod! + 1, methodToAdd);


        const declarationRecorder = tree.beginUpdate(filePath);
        declarationRecorder.insertLeft(methodAddChange.pos, methodAddChange.toAdd);
        tree.commitUpdate(declarationRecorder);

        return tree;
    };
}
