// Type definitions for kuzzle v1.0-RC10
// Project: https://github.com/kuzzleio/kuzzle
// Definitions by: David <https://github.com/dbengsch>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Provides type definition for the plugin context of Kuzzle <http://docs.kuzzle.io/plugin-reference/#the-plugin-context>

/// <reference types="types-kuzzle-common-objects" />
/// <reference types="passport" />

import passport = require('passport')
import {KuzzleRequest, KuzzleRequestInput, KuzzleRequestContext, KuzzleErrors} from "../types-kuzzle-common-objects/index"

declare class KuzzleDsl {
    exists(index: string, collection: string): boolean
    getFilterIds(index: string, collection: string): string[]
    register(index: string, collection: string, filters: any): Promise<boolean|{id: string, diff: boolean|any}>
    remove(filterId: string): Promise<void>
    test(index: string, collection: string, data: any, documentId: string): string[]
    validate(filters: any): Promise<void>
}

export interface KuzzlePluginLogs {
    silly(msg: string|any): void
    verbose(msg: string|any): void
    info(msg: string|any): void
    debug(msg: string|any): void
    warn(msg: string|any): void
    error(msg: string|any): void
}

export interface KuzzlePluginPassport {
    use(strategy: passport.Strategy): passport.Passport
}

interface KuzzleSearchResult {
    total: number
    hits: any[]
}

export class KuzzlePluginRepository {
    constructor(collection: string, ObjectConstructor?: string)

    search(query: any, from?: number, size?: number): Promise<KuzzleSearchResult>
    get(documentId: string): Promise<any>
    mGet(documentIds: string[]): Promise<KuzzleSearchResult>
    delete(documentId: string): Promise<any>
    create(document: any): Promise<any>
    createOrReplace(document: any): Promise<any>
    replace(document: any): Promise<any>
    update(document: any): Promise<any>
}

export interface KuzzlePluginRepositoryFactory {
    new(collection: string, ObjectConstructor?: string): KuzzlePluginRepository
    (collection: string, ObjectConstructor?: string): KuzzlePluginRepository
}

declare class KuzzleBaseValidationType {
    typeName: string
    allowChildren: boolean
    allowedTypeOptions: string[]

    constructor()

    validate(typeOptions: any, fieldValue: any, errorMessage: string[]): boolean
    validateFieldSpecification(typeOptions: any): any
}

export interface KuzzlePluginContext {
    log: KuzzlePluginLogs

    accessors: {
        passport: KuzzlePluginPassport
        validation: {
            addType(): void
            validate(): KuzzleRequest|{errorMessages: string[], validation: any}
        }
        storage: {
            bootstrap(collectionsMapping?: any): Promise<boolean>
            createCollection(collectionMapping: any): Promise<{acknowledged: boolean}>
        }

        execute(request: KuzzleRequest): Promise<KuzzleRequest>
        execute(request: KuzzleRequest, callback: (err: Error, request: KuzzleRequest) => KuzzleRequest): void
    }

    constructors: {
        Repository: KuzzlePluginRepositoryFactory
        Dsl: KuzzleDsl
        Request: KuzzleRequest
        RequestContext: KuzzleRequestContext
        RequestInput: KuzzleRequestInput
        BaseValidationType: KuzzleBaseValidationType
    }

    errors: KuzzleErrors
}
