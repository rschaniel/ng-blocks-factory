# NG Blocks Factory

This is a collection of Angular schematics. Currently the following schematics are available:

* http-service

## Usage 

ng generate ng-blocks-factory:http-service Customer /api/v1/customer

ng generate ../ng-blocks-factory/src/collection.json:http-service shared/services/Customer /api/v1/customer 
ng generate ../ng-blocks-factory/src/collection.json:add-http-call shared/services/Customer /api/v1/customer 

## Testing

npm run build && jasmine src/add-http-call/ast-utils/ast-utils.spec.js

