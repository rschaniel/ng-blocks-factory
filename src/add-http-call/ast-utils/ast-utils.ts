import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { SchematicsException } from '@angular-devkit/schematics';


export function findServiceClassNode(node: ts.Node): ts.Node | null {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        return node;
    } else {
        let result = null;
        for (let i = 0; result == null && i < node.getChildCount(); i ++) {
            result = findServiceClassNode(node.getChildren()[i]);
        }
        return result;
    }
    return null;
}

export function findMethodNode(node: ts.Node, methodName: string): ts.Node | null {
    if (node.kind === ts.SyntaxKind.MethodDeclaration &&
        getImmediateIdentifierChild(node)?.getText() === methodName) {
        return node;
    } else {
        let result = null;
        for (let i = 0; result == null && i < node.getChildCount(); i ++) {
            result = findMethodNode(node.getChildren()[i], methodName);
        }
        return result;
    }
    return null;
}

export function getImmediateIdentifierChild(node: ts.Node): ts.Node | null {
    const identifierChildren = node.getChildren()
        .filter(childNode => childNode.kind === ts.SyntaxKind.Identifier);


    return identifierChildren?.length > 0 ? identifierChildren[0] : null;
}

export function getLastPosition(node: ts.Node): number | undefined {
    return node?.getLastToken()?.getEnd()
}

export function printTree(node: ts.Node, indent: string = '    '): void {
    console.log(indent + ts.SyntaxKind[node.kind]);

    if (node.getChildCount() === 0) {
        console.log(indent + '    Text: ' + node.getText());
    }

    for(let child of node.getChildren()) {
        printTree(child, indent + '    ');
    }
}


export function getSourceFileNode(filePath: string): ts.Node {
    const buffer = readFileSync(filePath);
    if (!buffer) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }

    const content = buffer.toString('utf-8');

    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    return sourceFile;
}
