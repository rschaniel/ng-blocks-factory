import * as ts from 'typescript';
import {
    findMethodNode,
    findServiceClassNode,
    getImmediateIdentifierChild, getLastPosition,
    getSourceFileNode,
} from './ast-utils';


describe('AST utils', () => {

    it('should find the class definition for the service', () => {
        const sourceFileNode: ts.Node = getSourceFileNode('src/add-http-call/ast-utils/customer.http-service.ts');
        const serviceClassNode = findServiceClassNode(sourceFileNode);

        if (serviceClassNode) {
            console.log('found class node');
        } else {
            console.warn('no service class node found');
        }

        expect(serviceClassNode).toBeDefined();
        expect(serviceClassNode!.getChildren()[2].getText()).toEqual('CustomerHttpService');
    });

    it('should return the identifier child', () => {
        const sourceFileNode: ts.Node = getSourceFileNode('src/add-http-call/ast-utils/customer.http-service.ts');
        const serviceClassNode = findServiceClassNode(sourceFileNode);

        const identifierNode = getImmediateIdentifierChild(serviceClassNode!);
        expect(identifierNode!.getText()).toEqual('CustomerHttpService');
    });

    it('should find a method node', () => {
        const sourceFileNode: ts.Node = getSourceFileNode('src/add-http-call/ast-utils/customer.http-service.ts');
        const serviceClassNode = findServiceClassNode(sourceFileNode);

        const methodNode = findMethodNode(serviceClassNode!, 'getById');

        if (methodNode) {
            console.log('found method methodNode');
        } else {
            console.warn('no method methodNode found');
        }

        expect(methodNode).toBeDefined();
        const identifierNode = getImmediateIdentifierChild(methodNode!);
        expect(identifierNode?.getText()).toEqual('getById');
    });

    it('should return the last position of a node', () => {
        const sourceFileNode: ts.Node = getSourceFileNode('src/add-http-call/ast-utils/customer.http-service.ts');
        const serviceClassNode = findServiceClassNode(sourceFileNode);

        expect(getLastPosition(serviceClassNode!)).toEqual(389);
    });

});
