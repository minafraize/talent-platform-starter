
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model TalentProfile
 * 
 */
export type TalentProfile = $Result.DefaultSelection<Prisma.$TalentProfilePayload>
/**
 * Model ProfessionalProfile
 * 
 */
export type ProfessionalProfile = $Result.DefaultSelection<Prisma.$ProfessionalProfilePayload>
/**
 * Model ProcessedEvent
 * 
 */
export type ProcessedEvent = $Result.DefaultSelection<Prisma.$ProcessedEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AccountType: {
  USER: 'USER',
  TALENT: 'TALENT',
  PROFESSIONAL: 'PROFESSIONAL'
};

export type AccountType = (typeof AccountType)[keyof typeof AccountType]


export const AccountStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED'
};

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus]


export const TalentProfileStatus: {
  ACTIVE: 'ACTIVE',
  CONVERTED: 'CONVERTED'
};

export type TalentProfileStatus = (typeof TalentProfileStatus)[keyof typeof TalentProfileStatus]

}

export type AccountType = $Enums.AccountType

export const AccountType: typeof $Enums.AccountType

export type AccountStatus = $Enums.AccountStatus

export const AccountStatus: typeof $Enums.AccountStatus

export type TalentProfileStatus = $Enums.TalentProfileStatus

export const TalentProfileStatus: typeof $Enums.TalentProfileStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.talentProfile`: Exposes CRUD operations for the **TalentProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TalentProfiles
    * const talentProfiles = await prisma.talentProfile.findMany()
    * ```
    */
  get talentProfile(): Prisma.TalentProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.professionalProfile`: Exposes CRUD operations for the **ProfessionalProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfessionalProfiles
    * const professionalProfiles = await prisma.professionalProfile.findMany()
    * ```
    */
  get professionalProfile(): Prisma.ProfessionalProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.processedEvent`: Exposes CRUD operations for the **ProcessedEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessedEvents
    * const processedEvents = await prisma.processedEvent.findMany()
    * ```
    */
  get processedEvent(): Prisma.ProcessedEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Profile: 'Profile',
    TalentProfile: 'TalentProfile',
    ProfessionalProfile: 'ProfessionalProfile',
    ProcessedEvent: 'ProcessedEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "profile" | "talentProfile" | "professionalProfile" | "processedEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      TalentProfile: {
        payload: Prisma.$TalentProfilePayload<ExtArgs>
        fields: Prisma.TalentProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TalentProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TalentProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          findFirst: {
            args: Prisma.TalentProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TalentProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          findMany: {
            args: Prisma.TalentProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>[]
          }
          create: {
            args: Prisma.TalentProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          createMany: {
            args: Prisma.TalentProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TalentProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>[]
          }
          delete: {
            args: Prisma.TalentProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          update: {
            args: Prisma.TalentProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          deleteMany: {
            args: Prisma.TalentProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TalentProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TalentProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>[]
          }
          upsert: {
            args: Prisma.TalentProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TalentProfilePayload>
          }
          aggregate: {
            args: Prisma.TalentProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTalentProfile>
          }
          groupBy: {
            args: Prisma.TalentProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<TalentProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.TalentProfileCountArgs<ExtArgs>
            result: $Utils.Optional<TalentProfileCountAggregateOutputType> | number
          }
        }
      }
      ProfessionalProfile: {
        payload: Prisma.$ProfessionalProfilePayload<ExtArgs>
        fields: Prisma.ProfessionalProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfessionalProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfessionalProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfessionalProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfessionalProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          findMany: {
            args: Prisma.ProfessionalProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>[]
          }
          create: {
            args: Prisma.ProfessionalProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          createMany: {
            args: Prisma.ProfessionalProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfessionalProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfessionalProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          update: {
            args: Prisma.ProfessionalProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfessionalProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfessionalProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfessionalProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfessionalProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfessionalProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfessionalProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfessionalProfile>
          }
          groupBy: {
            args: Prisma.ProfessionalProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfessionalProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfessionalProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfessionalProfileCountAggregateOutputType> | number
          }
        }
      }
      ProcessedEvent: {
        payload: Prisma.$ProcessedEventPayload<ExtArgs>
        fields: Prisma.ProcessedEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessedEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessedEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          findFirst: {
            args: Prisma.ProcessedEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessedEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          findMany: {
            args: Prisma.ProcessedEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[]
          }
          create: {
            args: Prisma.ProcessedEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          createMany: {
            args: Prisma.ProcessedEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcessedEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[]
          }
          delete: {
            args: Prisma.ProcessedEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          update: {
            args: Prisma.ProcessedEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          deleteMany: {
            args: Prisma.ProcessedEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessedEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProcessedEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[]
          }
          upsert: {
            args: Prisma.ProcessedEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          aggregate: {
            args: Prisma.ProcessedEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcessedEvent>
          }
          groupBy: {
            args: Prisma.ProcessedEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessedEventCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    profile?: ProfileOmit
    talentProfile?: TalentProfileOmit
    professionalProfile?: ProfessionalProfileOmit
    processedEvent?: ProcessedEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.AccountType | null
    status: $Enums.AccountStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.AccountType | null
    status: $Enums.AccountStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: $Enums.AccountType
    status: $Enums.AccountStatus
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | Account$profileArgs<ExtArgs>
    talentProfile?: boolean | Account$talentProfileArgs<ExtArgs>
    professionalProfile?: boolean | Account$professionalProfileArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | Account$profileArgs<ExtArgs>
    talentProfile?: boolean | Account$talentProfileArgs<ExtArgs>
    professionalProfile?: boolean | Account$professionalProfileArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs> | null
      talentProfile: Prisma.$TalentProfilePayload<ExtArgs> | null
      professionalProfile: Prisma.$ProfessionalProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: $Enums.AccountType
      status: $Enums.AccountStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends Account$profileArgs<ExtArgs> = {}>(args?: Subset<T, Account$profileArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    talentProfile<T extends Account$talentProfileArgs<ExtArgs> = {}>(args?: Subset<T, Account$talentProfileArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    professionalProfile<T extends Account$professionalProfileArgs<ExtArgs> = {}>(args?: Subset<T, Account$professionalProfileArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'AccountType'>
    readonly status: FieldRef<"Account", 'AccountStatus'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account.profile
   */
  export type Account$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * Account.talentProfile
   */
  export type Account$talentProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    where?: TalentProfileWhereInput
  }

  /**
   * Account.professionalProfile
   */
  export type Account$professionalProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    where?: ProfessionalProfileWhereInput
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    username: string | null
    displayName: string | null
    bio: string | null
    avatarMediaId: string | null
    countryCode: string | null
    city: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    username: string | null
    displayName: string | null
    bio: string | null
    avatarMediaId: string | null
    countryCode: string | null
    city: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    accountId: number
    username: number
    displayName: number
    bio: number
    avatarMediaId: number
    countryCode: number
    city: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    accountId?: true
    username?: true
    displayName?: true
    bio?: true
    avatarMediaId?: true
    countryCode?: true
    city?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    accountId?: true
    username?: true
    displayName?: true
    bio?: true
    avatarMediaId?: true
    countryCode?: true
    city?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    accountId?: true
    username?: true
    displayName?: true
    bio?: true
    avatarMediaId?: true
    countryCode?: true
    city?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    accountId: string
    username: string | null
    displayName: string | null
    bio: string | null
    avatarMediaId: string | null
    countryCode: string | null
    city: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    username?: boolean
    displayName?: boolean
    bio?: boolean
    avatarMediaId?: boolean
    countryCode?: boolean
    city?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    username?: boolean
    displayName?: boolean
    bio?: boolean
    avatarMediaId?: boolean
    countryCode?: boolean
    city?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    username?: boolean
    displayName?: boolean
    bio?: boolean
    avatarMediaId?: boolean
    countryCode?: boolean
    city?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    accountId?: boolean
    username?: boolean
    displayName?: boolean
    bio?: boolean
    avatarMediaId?: boolean
    countryCode?: boolean
    city?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "username" | "displayName" | "bio" | "avatarMediaId" | "countryCode" | "city" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      username: string | null
      displayName: string | null
      bio: string | null
      avatarMediaId: string | null
      countryCode: string | null
      city: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly accountId: FieldRef<"Profile", 'String'>
    readonly username: FieldRef<"Profile", 'String'>
    readonly displayName: FieldRef<"Profile", 'String'>
    readonly bio: FieldRef<"Profile", 'String'>
    readonly avatarMediaId: FieldRef<"Profile", 'String'>
    readonly countryCode: FieldRef<"Profile", 'String'>
    readonly city: FieldRef<"Profile", 'String'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model TalentProfile
   */

  export type AggregateTalentProfile = {
    _count: TalentProfileCountAggregateOutputType | null
    _avg: TalentProfileAvgAggregateOutputType | null
    _sum: TalentProfileSumAggregateOutputType | null
    _min: TalentProfileMinAggregateOutputType | null
    _max: TalentProfileMaxAggregateOutputType | null
  }

  export type TalentProfileAvgAggregateOutputType = {
    score: number | null
  }

  export type TalentProfileSumAggregateOutputType = {
    score: number | null
  }

  export type TalentProfileMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    status: $Enums.TalentProfileStatus | null
    score: number | null
    convertedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TalentProfileMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    status: $Enums.TalentProfileStatus | null
    score: number | null
    convertedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TalentProfileCountAggregateOutputType = {
    id: number
    accountId: number
    status: number
    score: number
    convertedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TalentProfileAvgAggregateInputType = {
    score?: true
  }

  export type TalentProfileSumAggregateInputType = {
    score?: true
  }

  export type TalentProfileMinAggregateInputType = {
    id?: true
    accountId?: true
    status?: true
    score?: true
    convertedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TalentProfileMaxAggregateInputType = {
    id?: true
    accountId?: true
    status?: true
    score?: true
    convertedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TalentProfileCountAggregateInputType = {
    id?: true
    accountId?: true
    status?: true
    score?: true
    convertedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TalentProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TalentProfile to aggregate.
     */
    where?: TalentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TalentProfiles to fetch.
     */
    orderBy?: TalentProfileOrderByWithRelationInput | TalentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TalentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TalentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TalentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TalentProfiles
    **/
    _count?: true | TalentProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TalentProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TalentProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TalentProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TalentProfileMaxAggregateInputType
  }

  export type GetTalentProfileAggregateType<T extends TalentProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateTalentProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTalentProfile[P]>
      : GetScalarType<T[P], AggregateTalentProfile[P]>
  }




  export type TalentProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TalentProfileWhereInput
    orderBy?: TalentProfileOrderByWithAggregationInput | TalentProfileOrderByWithAggregationInput[]
    by: TalentProfileScalarFieldEnum[] | TalentProfileScalarFieldEnum
    having?: TalentProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TalentProfileCountAggregateInputType | true
    _avg?: TalentProfileAvgAggregateInputType
    _sum?: TalentProfileSumAggregateInputType
    _min?: TalentProfileMinAggregateInputType
    _max?: TalentProfileMaxAggregateInputType
  }

  export type TalentProfileGroupByOutputType = {
    id: string
    accountId: string
    status: $Enums.TalentProfileStatus
    score: number
    convertedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TalentProfileCountAggregateOutputType | null
    _avg: TalentProfileAvgAggregateOutputType | null
    _sum: TalentProfileSumAggregateOutputType | null
    _min: TalentProfileMinAggregateOutputType | null
    _max: TalentProfileMaxAggregateOutputType | null
  }

  type GetTalentProfileGroupByPayload<T extends TalentProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TalentProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TalentProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TalentProfileGroupByOutputType[P]>
            : GetScalarType<T[P], TalentProfileGroupByOutputType[P]>
        }
      >
    >


  export type TalentProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    status?: boolean
    score?: boolean
    convertedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["talentProfile"]>

  export type TalentProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    status?: boolean
    score?: boolean
    convertedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["talentProfile"]>

  export type TalentProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    status?: boolean
    score?: boolean
    convertedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["talentProfile"]>

  export type TalentProfileSelectScalar = {
    id?: boolean
    accountId?: boolean
    status?: boolean
    score?: boolean
    convertedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TalentProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "status" | "score" | "convertedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["talentProfile"]>
  export type TalentProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type TalentProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type TalentProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $TalentProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TalentProfile"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      status: $Enums.TalentProfileStatus
      score: number
      convertedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["talentProfile"]>
    composites: {}
  }

  type TalentProfileGetPayload<S extends boolean | null | undefined | TalentProfileDefaultArgs> = $Result.GetResult<Prisma.$TalentProfilePayload, S>

  type TalentProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TalentProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TalentProfileCountAggregateInputType | true
    }

  export interface TalentProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TalentProfile'], meta: { name: 'TalentProfile' } }
    /**
     * Find zero or one TalentProfile that matches the filter.
     * @param {TalentProfileFindUniqueArgs} args - Arguments to find a TalentProfile
     * @example
     * // Get one TalentProfile
     * const talentProfile = await prisma.talentProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TalentProfileFindUniqueArgs>(args: SelectSubset<T, TalentProfileFindUniqueArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TalentProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TalentProfileFindUniqueOrThrowArgs} args - Arguments to find a TalentProfile
     * @example
     * // Get one TalentProfile
     * const talentProfile = await prisma.talentProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TalentProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, TalentProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TalentProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileFindFirstArgs} args - Arguments to find a TalentProfile
     * @example
     * // Get one TalentProfile
     * const talentProfile = await prisma.talentProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TalentProfileFindFirstArgs>(args?: SelectSubset<T, TalentProfileFindFirstArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TalentProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileFindFirstOrThrowArgs} args - Arguments to find a TalentProfile
     * @example
     * // Get one TalentProfile
     * const talentProfile = await prisma.talentProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TalentProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, TalentProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TalentProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TalentProfiles
     * const talentProfiles = await prisma.talentProfile.findMany()
     * 
     * // Get first 10 TalentProfiles
     * const talentProfiles = await prisma.talentProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const talentProfileWithIdOnly = await prisma.talentProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TalentProfileFindManyArgs>(args?: SelectSubset<T, TalentProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TalentProfile.
     * @param {TalentProfileCreateArgs} args - Arguments to create a TalentProfile.
     * @example
     * // Create one TalentProfile
     * const TalentProfile = await prisma.talentProfile.create({
     *   data: {
     *     // ... data to create a TalentProfile
     *   }
     * })
     * 
     */
    create<T extends TalentProfileCreateArgs>(args: SelectSubset<T, TalentProfileCreateArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TalentProfiles.
     * @param {TalentProfileCreateManyArgs} args - Arguments to create many TalentProfiles.
     * @example
     * // Create many TalentProfiles
     * const talentProfile = await prisma.talentProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TalentProfileCreateManyArgs>(args?: SelectSubset<T, TalentProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TalentProfiles and returns the data saved in the database.
     * @param {TalentProfileCreateManyAndReturnArgs} args - Arguments to create many TalentProfiles.
     * @example
     * // Create many TalentProfiles
     * const talentProfile = await prisma.talentProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TalentProfiles and only return the `id`
     * const talentProfileWithIdOnly = await prisma.talentProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TalentProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, TalentProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TalentProfile.
     * @param {TalentProfileDeleteArgs} args - Arguments to delete one TalentProfile.
     * @example
     * // Delete one TalentProfile
     * const TalentProfile = await prisma.talentProfile.delete({
     *   where: {
     *     // ... filter to delete one TalentProfile
     *   }
     * })
     * 
     */
    delete<T extends TalentProfileDeleteArgs>(args: SelectSubset<T, TalentProfileDeleteArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TalentProfile.
     * @param {TalentProfileUpdateArgs} args - Arguments to update one TalentProfile.
     * @example
     * // Update one TalentProfile
     * const talentProfile = await prisma.talentProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TalentProfileUpdateArgs>(args: SelectSubset<T, TalentProfileUpdateArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TalentProfiles.
     * @param {TalentProfileDeleteManyArgs} args - Arguments to filter TalentProfiles to delete.
     * @example
     * // Delete a few TalentProfiles
     * const { count } = await prisma.talentProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TalentProfileDeleteManyArgs>(args?: SelectSubset<T, TalentProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TalentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TalentProfiles
     * const talentProfile = await prisma.talentProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TalentProfileUpdateManyArgs>(args: SelectSubset<T, TalentProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TalentProfiles and returns the data updated in the database.
     * @param {TalentProfileUpdateManyAndReturnArgs} args - Arguments to update many TalentProfiles.
     * @example
     * // Update many TalentProfiles
     * const talentProfile = await prisma.talentProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TalentProfiles and only return the `id`
     * const talentProfileWithIdOnly = await prisma.talentProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TalentProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, TalentProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TalentProfile.
     * @param {TalentProfileUpsertArgs} args - Arguments to update or create a TalentProfile.
     * @example
     * // Update or create a TalentProfile
     * const talentProfile = await prisma.talentProfile.upsert({
     *   create: {
     *     // ... data to create a TalentProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TalentProfile we want to update
     *   }
     * })
     */
    upsert<T extends TalentProfileUpsertArgs>(args: SelectSubset<T, TalentProfileUpsertArgs<ExtArgs>>): Prisma__TalentProfileClient<$Result.GetResult<Prisma.$TalentProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TalentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileCountArgs} args - Arguments to filter TalentProfiles to count.
     * @example
     * // Count the number of TalentProfiles
     * const count = await prisma.talentProfile.count({
     *   where: {
     *     // ... the filter for the TalentProfiles we want to count
     *   }
     * })
    **/
    count<T extends TalentProfileCountArgs>(
      args?: Subset<T, TalentProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TalentProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TalentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TalentProfileAggregateArgs>(args: Subset<T, TalentProfileAggregateArgs>): Prisma.PrismaPromise<GetTalentProfileAggregateType<T>>

    /**
     * Group by TalentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TalentProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TalentProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TalentProfileGroupByArgs['orderBy'] }
        : { orderBy?: TalentProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TalentProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTalentProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TalentProfile model
   */
  readonly fields: TalentProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TalentProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TalentProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TalentProfile model
   */
  interface TalentProfileFieldRefs {
    readonly id: FieldRef<"TalentProfile", 'String'>
    readonly accountId: FieldRef<"TalentProfile", 'String'>
    readonly status: FieldRef<"TalentProfile", 'TalentProfileStatus'>
    readonly score: FieldRef<"TalentProfile", 'Int'>
    readonly convertedAt: FieldRef<"TalentProfile", 'DateTime'>
    readonly createdAt: FieldRef<"TalentProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"TalentProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TalentProfile findUnique
   */
  export type TalentProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter, which TalentProfile to fetch.
     */
    where: TalentProfileWhereUniqueInput
  }

  /**
   * TalentProfile findUniqueOrThrow
   */
  export type TalentProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter, which TalentProfile to fetch.
     */
    where: TalentProfileWhereUniqueInput
  }

  /**
   * TalentProfile findFirst
   */
  export type TalentProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter, which TalentProfile to fetch.
     */
    where?: TalentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TalentProfiles to fetch.
     */
    orderBy?: TalentProfileOrderByWithRelationInput | TalentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TalentProfiles.
     */
    cursor?: TalentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TalentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TalentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TalentProfiles.
     */
    distinct?: TalentProfileScalarFieldEnum | TalentProfileScalarFieldEnum[]
  }

  /**
   * TalentProfile findFirstOrThrow
   */
  export type TalentProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter, which TalentProfile to fetch.
     */
    where?: TalentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TalentProfiles to fetch.
     */
    orderBy?: TalentProfileOrderByWithRelationInput | TalentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TalentProfiles.
     */
    cursor?: TalentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TalentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TalentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TalentProfiles.
     */
    distinct?: TalentProfileScalarFieldEnum | TalentProfileScalarFieldEnum[]
  }

  /**
   * TalentProfile findMany
   */
  export type TalentProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter, which TalentProfiles to fetch.
     */
    where?: TalentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TalentProfiles to fetch.
     */
    orderBy?: TalentProfileOrderByWithRelationInput | TalentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TalentProfiles.
     */
    cursor?: TalentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TalentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TalentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TalentProfiles.
     */
    distinct?: TalentProfileScalarFieldEnum | TalentProfileScalarFieldEnum[]
  }

  /**
   * TalentProfile create
   */
  export type TalentProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a TalentProfile.
     */
    data: XOR<TalentProfileCreateInput, TalentProfileUncheckedCreateInput>
  }

  /**
   * TalentProfile createMany
   */
  export type TalentProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TalentProfiles.
     */
    data: TalentProfileCreateManyInput | TalentProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TalentProfile createManyAndReturn
   */
  export type TalentProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * The data used to create many TalentProfiles.
     */
    data: TalentProfileCreateManyInput | TalentProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TalentProfile update
   */
  export type TalentProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a TalentProfile.
     */
    data: XOR<TalentProfileUpdateInput, TalentProfileUncheckedUpdateInput>
    /**
     * Choose, which TalentProfile to update.
     */
    where: TalentProfileWhereUniqueInput
  }

  /**
   * TalentProfile updateMany
   */
  export type TalentProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TalentProfiles.
     */
    data: XOR<TalentProfileUpdateManyMutationInput, TalentProfileUncheckedUpdateManyInput>
    /**
     * Filter which TalentProfiles to update
     */
    where?: TalentProfileWhereInput
    /**
     * Limit how many TalentProfiles to update.
     */
    limit?: number
  }

  /**
   * TalentProfile updateManyAndReturn
   */
  export type TalentProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * The data used to update TalentProfiles.
     */
    data: XOR<TalentProfileUpdateManyMutationInput, TalentProfileUncheckedUpdateManyInput>
    /**
     * Filter which TalentProfiles to update
     */
    where?: TalentProfileWhereInput
    /**
     * Limit how many TalentProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TalentProfile upsert
   */
  export type TalentProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the TalentProfile to update in case it exists.
     */
    where: TalentProfileWhereUniqueInput
    /**
     * In case the TalentProfile found by the `where` argument doesn't exist, create a new TalentProfile with this data.
     */
    create: XOR<TalentProfileCreateInput, TalentProfileUncheckedCreateInput>
    /**
     * In case the TalentProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TalentProfileUpdateInput, TalentProfileUncheckedUpdateInput>
  }

  /**
   * TalentProfile delete
   */
  export type TalentProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
    /**
     * Filter which TalentProfile to delete.
     */
    where: TalentProfileWhereUniqueInput
  }

  /**
   * TalentProfile deleteMany
   */
  export type TalentProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TalentProfiles to delete
     */
    where?: TalentProfileWhereInput
    /**
     * Limit how many TalentProfiles to delete.
     */
    limit?: number
  }

  /**
   * TalentProfile without action
   */
  export type TalentProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TalentProfile
     */
    select?: TalentProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TalentProfile
     */
    omit?: TalentProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TalentProfileInclude<ExtArgs> | null
  }


  /**
   * Model ProfessionalProfile
   */

  export type AggregateProfessionalProfile = {
    _count: ProfessionalProfileCountAggregateOutputType | null
    _min: ProfessionalProfileMinAggregateOutputType | null
    _max: ProfessionalProfileMaxAggregateOutputType | null
  }

  export type ProfessionalProfileMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    headline: string | null
    organization: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfessionalProfileMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    headline: string | null
    organization: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfessionalProfileCountAggregateOutputType = {
    id: number
    accountId: number
    headline: number
    organization: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfessionalProfileMinAggregateInputType = {
    id?: true
    accountId?: true
    headline?: true
    organization?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfessionalProfileMaxAggregateInputType = {
    id?: true
    accountId?: true
    headline?: true
    organization?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfessionalProfileCountAggregateInputType = {
    id?: true
    accountId?: true
    headline?: true
    organization?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfessionalProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfessionalProfile to aggregate.
     */
    where?: ProfessionalProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfessionalProfiles to fetch.
     */
    orderBy?: ProfessionalProfileOrderByWithRelationInput | ProfessionalProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfessionalProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfessionalProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfessionalProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfessionalProfiles
    **/
    _count?: true | ProfessionalProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfessionalProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfessionalProfileMaxAggregateInputType
  }

  export type GetProfessionalProfileAggregateType<T extends ProfessionalProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfessionalProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfessionalProfile[P]>
      : GetScalarType<T[P], AggregateProfessionalProfile[P]>
  }




  export type ProfessionalProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfessionalProfileWhereInput
    orderBy?: ProfessionalProfileOrderByWithAggregationInput | ProfessionalProfileOrderByWithAggregationInput[]
    by: ProfessionalProfileScalarFieldEnum[] | ProfessionalProfileScalarFieldEnum
    having?: ProfessionalProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfessionalProfileCountAggregateInputType | true
    _min?: ProfessionalProfileMinAggregateInputType
    _max?: ProfessionalProfileMaxAggregateInputType
  }

  export type ProfessionalProfileGroupByOutputType = {
    id: string
    accountId: string
    headline: string | null
    organization: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfessionalProfileCountAggregateOutputType | null
    _min: ProfessionalProfileMinAggregateOutputType | null
    _max: ProfessionalProfileMaxAggregateOutputType | null
  }

  type GetProfessionalProfileGroupByPayload<T extends ProfessionalProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfessionalProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfessionalProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfessionalProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfessionalProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfessionalProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    headline?: boolean
    organization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["professionalProfile"]>

  export type ProfessionalProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    headline?: boolean
    organization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["professionalProfile"]>

  export type ProfessionalProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    headline?: boolean
    organization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["professionalProfile"]>

  export type ProfessionalProfileSelectScalar = {
    id?: boolean
    accountId?: boolean
    headline?: boolean
    organization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfessionalProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "headline" | "organization" | "createdAt" | "updatedAt", ExtArgs["result"]["professionalProfile"]>
  export type ProfessionalProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type ProfessionalProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type ProfessionalProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $ProfessionalProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfessionalProfile"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      headline: string | null
      organization: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["professionalProfile"]>
    composites: {}
  }

  type ProfessionalProfileGetPayload<S extends boolean | null | undefined | ProfessionalProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfessionalProfilePayload, S>

  type ProfessionalProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfessionalProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfessionalProfileCountAggregateInputType | true
    }

  export interface ProfessionalProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfessionalProfile'], meta: { name: 'ProfessionalProfile' } }
    /**
     * Find zero or one ProfessionalProfile that matches the filter.
     * @param {ProfessionalProfileFindUniqueArgs} args - Arguments to find a ProfessionalProfile
     * @example
     * // Get one ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfessionalProfileFindUniqueArgs>(args: SelectSubset<T, ProfessionalProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProfessionalProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfessionalProfileFindUniqueOrThrowArgs} args - Arguments to find a ProfessionalProfile
     * @example
     * // Get one ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfessionalProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfessionalProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfessionalProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileFindFirstArgs} args - Arguments to find a ProfessionalProfile
     * @example
     * // Get one ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfessionalProfileFindFirstArgs>(args?: SelectSubset<T, ProfessionalProfileFindFirstArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfessionalProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileFindFirstOrThrowArgs} args - Arguments to find a ProfessionalProfile
     * @example
     * // Get one ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfessionalProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfessionalProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProfessionalProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfessionalProfiles
     * const professionalProfiles = await prisma.professionalProfile.findMany()
     * 
     * // Get first 10 ProfessionalProfiles
     * const professionalProfiles = await prisma.professionalProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const professionalProfileWithIdOnly = await prisma.professionalProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfessionalProfileFindManyArgs>(args?: SelectSubset<T, ProfessionalProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProfessionalProfile.
     * @param {ProfessionalProfileCreateArgs} args - Arguments to create a ProfessionalProfile.
     * @example
     * // Create one ProfessionalProfile
     * const ProfessionalProfile = await prisma.professionalProfile.create({
     *   data: {
     *     // ... data to create a ProfessionalProfile
     *   }
     * })
     * 
     */
    create<T extends ProfessionalProfileCreateArgs>(args: SelectSubset<T, ProfessionalProfileCreateArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProfessionalProfiles.
     * @param {ProfessionalProfileCreateManyArgs} args - Arguments to create many ProfessionalProfiles.
     * @example
     * // Create many ProfessionalProfiles
     * const professionalProfile = await prisma.professionalProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfessionalProfileCreateManyArgs>(args?: SelectSubset<T, ProfessionalProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfessionalProfiles and returns the data saved in the database.
     * @param {ProfessionalProfileCreateManyAndReturnArgs} args - Arguments to create many ProfessionalProfiles.
     * @example
     * // Create many ProfessionalProfiles
     * const professionalProfile = await prisma.professionalProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfessionalProfiles and only return the `id`
     * const professionalProfileWithIdOnly = await prisma.professionalProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfessionalProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfessionalProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProfessionalProfile.
     * @param {ProfessionalProfileDeleteArgs} args - Arguments to delete one ProfessionalProfile.
     * @example
     * // Delete one ProfessionalProfile
     * const ProfessionalProfile = await prisma.professionalProfile.delete({
     *   where: {
     *     // ... filter to delete one ProfessionalProfile
     *   }
     * })
     * 
     */
    delete<T extends ProfessionalProfileDeleteArgs>(args: SelectSubset<T, ProfessionalProfileDeleteArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProfessionalProfile.
     * @param {ProfessionalProfileUpdateArgs} args - Arguments to update one ProfessionalProfile.
     * @example
     * // Update one ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfessionalProfileUpdateArgs>(args: SelectSubset<T, ProfessionalProfileUpdateArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProfessionalProfiles.
     * @param {ProfessionalProfileDeleteManyArgs} args - Arguments to filter ProfessionalProfiles to delete.
     * @example
     * // Delete a few ProfessionalProfiles
     * const { count } = await prisma.professionalProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfessionalProfileDeleteManyArgs>(args?: SelectSubset<T, ProfessionalProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfessionalProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfessionalProfiles
     * const professionalProfile = await prisma.professionalProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfessionalProfileUpdateManyArgs>(args: SelectSubset<T, ProfessionalProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfessionalProfiles and returns the data updated in the database.
     * @param {ProfessionalProfileUpdateManyAndReturnArgs} args - Arguments to update many ProfessionalProfiles.
     * @example
     * // Update many ProfessionalProfiles
     * const professionalProfile = await prisma.professionalProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProfessionalProfiles and only return the `id`
     * const professionalProfileWithIdOnly = await prisma.professionalProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfessionalProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfessionalProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProfessionalProfile.
     * @param {ProfessionalProfileUpsertArgs} args - Arguments to update or create a ProfessionalProfile.
     * @example
     * // Update or create a ProfessionalProfile
     * const professionalProfile = await prisma.professionalProfile.upsert({
     *   create: {
     *     // ... data to create a ProfessionalProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfessionalProfile we want to update
     *   }
     * })
     */
    upsert<T extends ProfessionalProfileUpsertArgs>(args: SelectSubset<T, ProfessionalProfileUpsertArgs<ExtArgs>>): Prisma__ProfessionalProfileClient<$Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProfessionalProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileCountArgs} args - Arguments to filter ProfessionalProfiles to count.
     * @example
     * // Count the number of ProfessionalProfiles
     * const count = await prisma.professionalProfile.count({
     *   where: {
     *     // ... the filter for the ProfessionalProfiles we want to count
     *   }
     * })
    **/
    count<T extends ProfessionalProfileCountArgs>(
      args?: Subset<T, ProfessionalProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfessionalProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfessionalProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfessionalProfileAggregateArgs>(args: Subset<T, ProfessionalProfileAggregateArgs>): Prisma.PrismaPromise<GetProfessionalProfileAggregateType<T>>

    /**
     * Group by ProfessionalProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfessionalProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfessionalProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfessionalProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfessionalProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfessionalProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfessionalProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfessionalProfile model
   */
  readonly fields: ProfessionalProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfessionalProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfessionalProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProfessionalProfile model
   */
  interface ProfessionalProfileFieldRefs {
    readonly id: FieldRef<"ProfessionalProfile", 'String'>
    readonly accountId: FieldRef<"ProfessionalProfile", 'String'>
    readonly headline: FieldRef<"ProfessionalProfile", 'String'>
    readonly organization: FieldRef<"ProfessionalProfile", 'String'>
    readonly createdAt: FieldRef<"ProfessionalProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"ProfessionalProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfessionalProfile findUnique
   */
  export type ProfessionalProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter, which ProfessionalProfile to fetch.
     */
    where: ProfessionalProfileWhereUniqueInput
  }

  /**
   * ProfessionalProfile findUniqueOrThrow
   */
  export type ProfessionalProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter, which ProfessionalProfile to fetch.
     */
    where: ProfessionalProfileWhereUniqueInput
  }

  /**
   * ProfessionalProfile findFirst
   */
  export type ProfessionalProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter, which ProfessionalProfile to fetch.
     */
    where?: ProfessionalProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfessionalProfiles to fetch.
     */
    orderBy?: ProfessionalProfileOrderByWithRelationInput | ProfessionalProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfessionalProfiles.
     */
    cursor?: ProfessionalProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfessionalProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfessionalProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfessionalProfiles.
     */
    distinct?: ProfessionalProfileScalarFieldEnum | ProfessionalProfileScalarFieldEnum[]
  }

  /**
   * ProfessionalProfile findFirstOrThrow
   */
  export type ProfessionalProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter, which ProfessionalProfile to fetch.
     */
    where?: ProfessionalProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfessionalProfiles to fetch.
     */
    orderBy?: ProfessionalProfileOrderByWithRelationInput | ProfessionalProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfessionalProfiles.
     */
    cursor?: ProfessionalProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfessionalProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfessionalProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfessionalProfiles.
     */
    distinct?: ProfessionalProfileScalarFieldEnum | ProfessionalProfileScalarFieldEnum[]
  }

  /**
   * ProfessionalProfile findMany
   */
  export type ProfessionalProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter, which ProfessionalProfiles to fetch.
     */
    where?: ProfessionalProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfessionalProfiles to fetch.
     */
    orderBy?: ProfessionalProfileOrderByWithRelationInput | ProfessionalProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfessionalProfiles.
     */
    cursor?: ProfessionalProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfessionalProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfessionalProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfessionalProfiles.
     */
    distinct?: ProfessionalProfileScalarFieldEnum | ProfessionalProfileScalarFieldEnum[]
  }

  /**
   * ProfessionalProfile create
   */
  export type ProfessionalProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfessionalProfile.
     */
    data: XOR<ProfessionalProfileCreateInput, ProfessionalProfileUncheckedCreateInput>
  }

  /**
   * ProfessionalProfile createMany
   */
  export type ProfessionalProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfessionalProfiles.
     */
    data: ProfessionalProfileCreateManyInput | ProfessionalProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfessionalProfile createManyAndReturn
   */
  export type ProfessionalProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * The data used to create many ProfessionalProfiles.
     */
    data: ProfessionalProfileCreateManyInput | ProfessionalProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfessionalProfile update
   */
  export type ProfessionalProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfessionalProfile.
     */
    data: XOR<ProfessionalProfileUpdateInput, ProfessionalProfileUncheckedUpdateInput>
    /**
     * Choose, which ProfessionalProfile to update.
     */
    where: ProfessionalProfileWhereUniqueInput
  }

  /**
   * ProfessionalProfile updateMany
   */
  export type ProfessionalProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfessionalProfiles.
     */
    data: XOR<ProfessionalProfileUpdateManyMutationInput, ProfessionalProfileUncheckedUpdateManyInput>
    /**
     * Filter which ProfessionalProfiles to update
     */
    where?: ProfessionalProfileWhereInput
    /**
     * Limit how many ProfessionalProfiles to update.
     */
    limit?: number
  }

  /**
   * ProfessionalProfile updateManyAndReturn
   */
  export type ProfessionalProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * The data used to update ProfessionalProfiles.
     */
    data: XOR<ProfessionalProfileUpdateManyMutationInput, ProfessionalProfileUncheckedUpdateManyInput>
    /**
     * Filter which ProfessionalProfiles to update
     */
    where?: ProfessionalProfileWhereInput
    /**
     * Limit how many ProfessionalProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfessionalProfile upsert
   */
  export type ProfessionalProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfessionalProfile to update in case it exists.
     */
    where: ProfessionalProfileWhereUniqueInput
    /**
     * In case the ProfessionalProfile found by the `where` argument doesn't exist, create a new ProfessionalProfile with this data.
     */
    create: XOR<ProfessionalProfileCreateInput, ProfessionalProfileUncheckedCreateInput>
    /**
     * In case the ProfessionalProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfessionalProfileUpdateInput, ProfessionalProfileUncheckedUpdateInput>
  }

  /**
   * ProfessionalProfile delete
   */
  export type ProfessionalProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
    /**
     * Filter which ProfessionalProfile to delete.
     */
    where: ProfessionalProfileWhereUniqueInput
  }

  /**
   * ProfessionalProfile deleteMany
   */
  export type ProfessionalProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfessionalProfiles to delete
     */
    where?: ProfessionalProfileWhereInput
    /**
     * Limit how many ProfessionalProfiles to delete.
     */
    limit?: number
  }

  /**
   * ProfessionalProfile without action
   */
  export type ProfessionalProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfessionalProfile
     */
    select?: ProfessionalProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfessionalProfile
     */
    omit?: ProfessionalProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfessionalProfileInclude<ExtArgs> | null
  }


  /**
   * Model ProcessedEvent
   */

  export type AggregateProcessedEvent = {
    _count: ProcessedEventCountAggregateOutputType | null
    _min: ProcessedEventMinAggregateOutputType | null
    _max: ProcessedEventMaxAggregateOutputType | null
  }

  export type ProcessedEventMinAggregateOutputType = {
    eventId: string | null
    eventType: string | null
    processedAt: Date | null
  }

  export type ProcessedEventMaxAggregateOutputType = {
    eventId: string | null
    eventType: string | null
    processedAt: Date | null
  }

  export type ProcessedEventCountAggregateOutputType = {
    eventId: number
    eventType: number
    processedAt: number
    _all: number
  }


  export type ProcessedEventMinAggregateInputType = {
    eventId?: true
    eventType?: true
    processedAt?: true
  }

  export type ProcessedEventMaxAggregateInputType = {
    eventId?: true
    eventType?: true
    processedAt?: true
  }

  export type ProcessedEventCountAggregateInputType = {
    eventId?: true
    eventType?: true
    processedAt?: true
    _all?: true
  }

  export type ProcessedEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEvent to aggregate.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcessedEvents
    **/
    _count?: true | ProcessedEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessedEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessedEventMaxAggregateInputType
  }

  export type GetProcessedEventAggregateType<T extends ProcessedEventAggregateArgs> = {
        [P in keyof T & keyof AggregateProcessedEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessedEvent[P]>
      : GetScalarType<T[P], AggregateProcessedEvent[P]>
  }




  export type ProcessedEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessedEventWhereInput
    orderBy?: ProcessedEventOrderByWithAggregationInput | ProcessedEventOrderByWithAggregationInput[]
    by: ProcessedEventScalarFieldEnum[] | ProcessedEventScalarFieldEnum
    having?: ProcessedEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessedEventCountAggregateInputType | true
    _min?: ProcessedEventMinAggregateInputType
    _max?: ProcessedEventMaxAggregateInputType
  }

  export type ProcessedEventGroupByOutputType = {
    eventId: string
    eventType: string
    processedAt: Date
    _count: ProcessedEventCountAggregateOutputType | null
    _min: ProcessedEventMinAggregateOutputType | null
    _max: ProcessedEventMaxAggregateOutputType | null
  }

  type GetProcessedEventGroupByPayload<T extends ProcessedEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessedEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessedEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessedEventGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessedEventGroupByOutputType[P]>
        }
      >
    >


  export type ProcessedEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    eventId?: boolean
    eventType?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["processedEvent"]>

  export type ProcessedEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    eventId?: boolean
    eventType?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["processedEvent"]>

  export type ProcessedEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    eventId?: boolean
    eventType?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["processedEvent"]>

  export type ProcessedEventSelectScalar = {
    eventId?: boolean
    eventType?: boolean
    processedAt?: boolean
  }

  export type ProcessedEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"eventId" | "eventType" | "processedAt", ExtArgs["result"]["processedEvent"]>

  export type $ProcessedEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcessedEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      eventId: string
      eventType: string
      processedAt: Date
    }, ExtArgs["result"]["processedEvent"]>
    composites: {}
  }

  type ProcessedEventGetPayload<S extends boolean | null | undefined | ProcessedEventDefaultArgs> = $Result.GetResult<Prisma.$ProcessedEventPayload, S>

  type ProcessedEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProcessedEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProcessedEventCountAggregateInputType | true
    }

  export interface ProcessedEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcessedEvent'], meta: { name: 'ProcessedEvent' } }
    /**
     * Find zero or one ProcessedEvent that matches the filter.
     * @param {ProcessedEventFindUniqueArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessedEventFindUniqueArgs>(args: SelectSubset<T, ProcessedEventFindUniqueArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProcessedEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessedEventFindUniqueOrThrowArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessedEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessedEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessedEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindFirstArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessedEventFindFirstArgs>(args?: SelectSubset<T, ProcessedEventFindFirstArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessedEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindFirstOrThrowArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessedEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessedEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProcessedEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessedEvents
     * const processedEvents = await prisma.processedEvent.findMany()
     * 
     * // Get first 10 ProcessedEvents
     * const processedEvents = await prisma.processedEvent.findMany({ take: 10 })
     * 
     * // Only select the `eventId`
     * const processedEventWithEventIdOnly = await prisma.processedEvent.findMany({ select: { eventId: true } })
     * 
     */
    findMany<T extends ProcessedEventFindManyArgs>(args?: SelectSubset<T, ProcessedEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProcessedEvent.
     * @param {ProcessedEventCreateArgs} args - Arguments to create a ProcessedEvent.
     * @example
     * // Create one ProcessedEvent
     * const ProcessedEvent = await prisma.processedEvent.create({
     *   data: {
     *     // ... data to create a ProcessedEvent
     *   }
     * })
     * 
     */
    create<T extends ProcessedEventCreateArgs>(args: SelectSubset<T, ProcessedEventCreateArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProcessedEvents.
     * @param {ProcessedEventCreateManyArgs} args - Arguments to create many ProcessedEvents.
     * @example
     * // Create many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessedEventCreateManyArgs>(args?: SelectSubset<T, ProcessedEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcessedEvents and returns the data saved in the database.
     * @param {ProcessedEventCreateManyAndReturnArgs} args - Arguments to create many ProcessedEvents.
     * @example
     * // Create many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcessedEvents and only return the `eventId`
     * const processedEventWithEventIdOnly = await prisma.processedEvent.createManyAndReturn({
     *   select: { eventId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcessedEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcessedEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProcessedEvent.
     * @param {ProcessedEventDeleteArgs} args - Arguments to delete one ProcessedEvent.
     * @example
     * // Delete one ProcessedEvent
     * const ProcessedEvent = await prisma.processedEvent.delete({
     *   where: {
     *     // ... filter to delete one ProcessedEvent
     *   }
     * })
     * 
     */
    delete<T extends ProcessedEventDeleteArgs>(args: SelectSubset<T, ProcessedEventDeleteArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProcessedEvent.
     * @param {ProcessedEventUpdateArgs} args - Arguments to update one ProcessedEvent.
     * @example
     * // Update one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessedEventUpdateArgs>(args: SelectSubset<T, ProcessedEventUpdateArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProcessedEvents.
     * @param {ProcessedEventDeleteManyArgs} args - Arguments to filter ProcessedEvents to delete.
     * @example
     * // Delete a few ProcessedEvents
     * const { count } = await prisma.processedEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessedEventDeleteManyArgs>(args?: SelectSubset<T, ProcessedEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessedEventUpdateManyArgs>(args: SelectSubset<T, ProcessedEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessedEvents and returns the data updated in the database.
     * @param {ProcessedEventUpdateManyAndReturnArgs} args - Arguments to update many ProcessedEvents.
     * @example
     * // Update many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProcessedEvents and only return the `eventId`
     * const processedEventWithEventIdOnly = await prisma.processedEvent.updateManyAndReturn({
     *   select: { eventId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProcessedEventUpdateManyAndReturnArgs>(args: SelectSubset<T, ProcessedEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProcessedEvent.
     * @param {ProcessedEventUpsertArgs} args - Arguments to update or create a ProcessedEvent.
     * @example
     * // Update or create a ProcessedEvent
     * const processedEvent = await prisma.processedEvent.upsert({
     *   create: {
     *     // ... data to create a ProcessedEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessedEvent we want to update
     *   }
     * })
     */
    upsert<T extends ProcessedEventUpsertArgs>(args: SelectSubset<T, ProcessedEventUpsertArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProcessedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventCountArgs} args - Arguments to filter ProcessedEvents to count.
     * @example
     * // Count the number of ProcessedEvents
     * const count = await prisma.processedEvent.count({
     *   where: {
     *     // ... the filter for the ProcessedEvents we want to count
     *   }
     * })
    **/
    count<T extends ProcessedEventCountArgs>(
      args?: Subset<T, ProcessedEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessedEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcessedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessedEventAggregateArgs>(args: Subset<T, ProcessedEventAggregateArgs>): Prisma.PrismaPromise<GetProcessedEventAggregateType<T>>

    /**
     * Group by ProcessedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessedEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessedEventGroupByArgs['orderBy'] }
        : { orderBy?: ProcessedEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessedEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessedEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcessedEvent model
   */
  readonly fields: ProcessedEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessedEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessedEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcessedEvent model
   */
  interface ProcessedEventFieldRefs {
    readonly eventId: FieldRef<"ProcessedEvent", 'String'>
    readonly eventType: FieldRef<"ProcessedEvent", 'String'>
    readonly processedAt: FieldRef<"ProcessedEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcessedEvent findUnique
   */
  export type ProcessedEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent findUniqueOrThrow
   */
  export type ProcessedEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent findFirst
   */
  export type ProcessedEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEvents.
     */
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent findFirstOrThrow
   */
  export type ProcessedEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEvents.
     */
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent findMany
   */
  export type ProcessedEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter, which ProcessedEvents to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEvents.
     */
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent create
   */
  export type ProcessedEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * The data needed to create a ProcessedEvent.
     */
    data: XOR<ProcessedEventCreateInput, ProcessedEventUncheckedCreateInput>
  }

  /**
   * ProcessedEvent createMany
   */
  export type ProcessedEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessedEvents.
     */
    data: ProcessedEventCreateManyInput | ProcessedEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessedEvent createManyAndReturn
   */
  export type ProcessedEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * The data used to create many ProcessedEvents.
     */
    data: ProcessedEventCreateManyInput | ProcessedEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessedEvent update
   */
  export type ProcessedEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * The data needed to update a ProcessedEvent.
     */
    data: XOR<ProcessedEventUpdateInput, ProcessedEventUncheckedUpdateInput>
    /**
     * Choose, which ProcessedEvent to update.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent updateMany
   */
  export type ProcessedEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessedEvents.
     */
    data: XOR<ProcessedEventUpdateManyMutationInput, ProcessedEventUncheckedUpdateManyInput>
    /**
     * Filter which ProcessedEvents to update
     */
    where?: ProcessedEventWhereInput
    /**
     * Limit how many ProcessedEvents to update.
     */
    limit?: number
  }

  /**
   * ProcessedEvent updateManyAndReturn
   */
  export type ProcessedEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * The data used to update ProcessedEvents.
     */
    data: XOR<ProcessedEventUpdateManyMutationInput, ProcessedEventUncheckedUpdateManyInput>
    /**
     * Filter which ProcessedEvents to update
     */
    where?: ProcessedEventWhereInput
    /**
     * Limit how many ProcessedEvents to update.
     */
    limit?: number
  }

  /**
   * ProcessedEvent upsert
   */
  export type ProcessedEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * The filter to search for the ProcessedEvent to update in case it exists.
     */
    where: ProcessedEventWhereUniqueInput
    /**
     * In case the ProcessedEvent found by the `where` argument doesn't exist, create a new ProcessedEvent with this data.
     */
    create: XOR<ProcessedEventCreateInput, ProcessedEventUncheckedCreateInput>
    /**
     * In case the ProcessedEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessedEventUpdateInput, ProcessedEventUncheckedUpdateInput>
  }

  /**
   * ProcessedEvent delete
   */
  export type ProcessedEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
    /**
     * Filter which ProcessedEvent to delete.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent deleteMany
   */
  export type ProcessedEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEvents to delete
     */
    where?: ProcessedEventWhereInput
    /**
     * Limit how many ProcessedEvents to delete.
     */
    limit?: number
  }

  /**
   * ProcessedEvent without action
   */
  export type ProcessedEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEvent
     */
    omit?: ProcessedEventOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    username: 'username',
    displayName: 'displayName',
    bio: 'bio',
    avatarMediaId: 'avatarMediaId',
    countryCode: 'countryCode',
    city: 'city',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const TalentProfileScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    status: 'status',
    score: 'score',
    convertedAt: 'convertedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TalentProfileScalarFieldEnum = (typeof TalentProfileScalarFieldEnum)[keyof typeof TalentProfileScalarFieldEnum]


  export const ProfessionalProfileScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    headline: 'headline',
    organization: 'organization',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfessionalProfileScalarFieldEnum = (typeof ProfessionalProfileScalarFieldEnum)[keyof typeof ProfessionalProfileScalarFieldEnum]


  export const ProcessedEventScalarFieldEnum: {
    eventId: 'eventId',
    eventType: 'eventType',
    processedAt: 'processedAt'
  };

  export type ProcessedEventScalarFieldEnum = (typeof ProcessedEventScalarFieldEnum)[keyof typeof ProcessedEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'AccountType'
   */
  export type EnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountType'>
    


  /**
   * Reference to a field of type 'AccountType[]'
   */
  export type ListEnumAccountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountType[]'>
    


  /**
   * Reference to a field of type 'AccountStatus'
   */
  export type EnumAccountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountStatus'>
    


  /**
   * Reference to a field of type 'AccountStatus[]'
   */
  export type ListEnumAccountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TalentProfileStatus'
   */
  export type EnumTalentProfileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TalentProfileStatus'>
    


  /**
   * Reference to a field of type 'TalentProfileStatus[]'
   */
  export type ListEnumTalentProfileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TalentProfileStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: UuidFilter<"Account"> | string
    userId?: UuidFilter<"Account"> | string
    type?: EnumAccountTypeFilter<"Account"> | $Enums.AccountType
    status?: EnumAccountStatusFilter<"Account"> | $Enums.AccountStatus
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    talentProfile?: XOR<TalentProfileNullableScalarRelationFilter, TalentProfileWhereInput> | null
    professionalProfile?: XOR<ProfessionalProfileNullableScalarRelationFilter, ProfessionalProfileWhereInput> | null
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    talentProfile?: TalentProfileOrderByWithRelationInput
    professionalProfile?: ProfessionalProfileOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    type?: EnumAccountTypeFilter<"Account"> | $Enums.AccountType
    status?: EnumAccountStatusFilter<"Account"> | $Enums.AccountStatus
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    talentProfile?: XOR<TalentProfileNullableScalarRelationFilter, TalentProfileWhereInput> | null
    professionalProfile?: XOR<ProfessionalProfileNullableScalarRelationFilter, ProfessionalProfileWhereInput> | null
  }, "id" | "userId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Account"> | string
    userId?: UuidWithAggregatesFilter<"Account"> | string
    type?: EnumAccountTypeWithAggregatesFilter<"Account"> | $Enums.AccountType
    status?: EnumAccountStatusWithAggregatesFilter<"Account"> | $Enums.AccountStatus
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: UuidFilter<"Profile"> | string
    accountId?: UuidFilter<"Profile"> | string
    username?: StringNullableFilter<"Profile"> | string | null
    displayName?: StringNullableFilter<"Profile"> | string | null
    bio?: StringNullableFilter<"Profile"> | string | null
    avatarMediaId?: StringNullableFilter<"Profile"> | string | null
    countryCode?: StringNullableFilter<"Profile"> | string | null
    city?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    username?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarMediaId?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: AccountOrderByWithRelationInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountId?: string
    username?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    displayName?: StringNullableFilter<"Profile"> | string | null
    bio?: StringNullableFilter<"Profile"> | string | null
    avatarMediaId?: StringNullableFilter<"Profile"> | string | null
    countryCode?: StringNullableFilter<"Profile"> | string | null
    city?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id" | "accountId" | "username">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    username?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatarMediaId?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Profile"> | string
    accountId?: UuidWithAggregatesFilter<"Profile"> | string
    username?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    displayName?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    bio?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    avatarMediaId?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    countryCode?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    city?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type TalentProfileWhereInput = {
    AND?: TalentProfileWhereInput | TalentProfileWhereInput[]
    OR?: TalentProfileWhereInput[]
    NOT?: TalentProfileWhereInput | TalentProfileWhereInput[]
    id?: UuidFilter<"TalentProfile"> | string
    accountId?: UuidFilter<"TalentProfile"> | string
    status?: EnumTalentProfileStatusFilter<"TalentProfile"> | $Enums.TalentProfileStatus
    score?: IntFilter<"TalentProfile"> | number
    convertedAt?: DateTimeNullableFilter<"TalentProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"TalentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"TalentProfile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type TalentProfileOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    convertedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: AccountOrderByWithRelationInput
  }

  export type TalentProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountId?: string
    AND?: TalentProfileWhereInput | TalentProfileWhereInput[]
    OR?: TalentProfileWhereInput[]
    NOT?: TalentProfileWhereInput | TalentProfileWhereInput[]
    status?: EnumTalentProfileStatusFilter<"TalentProfile"> | $Enums.TalentProfileStatus
    score?: IntFilter<"TalentProfile"> | number
    convertedAt?: DateTimeNullableFilter<"TalentProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"TalentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"TalentProfile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id" | "accountId">

  export type TalentProfileOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    convertedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TalentProfileCountOrderByAggregateInput
    _avg?: TalentProfileAvgOrderByAggregateInput
    _max?: TalentProfileMaxOrderByAggregateInput
    _min?: TalentProfileMinOrderByAggregateInput
    _sum?: TalentProfileSumOrderByAggregateInput
  }

  export type TalentProfileScalarWhereWithAggregatesInput = {
    AND?: TalentProfileScalarWhereWithAggregatesInput | TalentProfileScalarWhereWithAggregatesInput[]
    OR?: TalentProfileScalarWhereWithAggregatesInput[]
    NOT?: TalentProfileScalarWhereWithAggregatesInput | TalentProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TalentProfile"> | string
    accountId?: UuidWithAggregatesFilter<"TalentProfile"> | string
    status?: EnumTalentProfileStatusWithAggregatesFilter<"TalentProfile"> | $Enums.TalentProfileStatus
    score?: IntWithAggregatesFilter<"TalentProfile"> | number
    convertedAt?: DateTimeNullableWithAggregatesFilter<"TalentProfile"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TalentProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TalentProfile"> | Date | string
  }

  export type ProfessionalProfileWhereInput = {
    AND?: ProfessionalProfileWhereInput | ProfessionalProfileWhereInput[]
    OR?: ProfessionalProfileWhereInput[]
    NOT?: ProfessionalProfileWhereInput | ProfessionalProfileWhereInput[]
    id?: UuidFilter<"ProfessionalProfile"> | string
    accountId?: UuidFilter<"ProfessionalProfile"> | string
    headline?: StringNullableFilter<"ProfessionalProfile"> | string | null
    organization?: StringNullableFilter<"ProfessionalProfile"> | string | null
    createdAt?: DateTimeFilter<"ProfessionalProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ProfessionalProfile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type ProfessionalProfileOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    headline?: SortOrderInput | SortOrder
    organization?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: AccountOrderByWithRelationInput
  }

  export type ProfessionalProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountId?: string
    AND?: ProfessionalProfileWhereInput | ProfessionalProfileWhereInput[]
    OR?: ProfessionalProfileWhereInput[]
    NOT?: ProfessionalProfileWhereInput | ProfessionalProfileWhereInput[]
    headline?: StringNullableFilter<"ProfessionalProfile"> | string | null
    organization?: StringNullableFilter<"ProfessionalProfile"> | string | null
    createdAt?: DateTimeFilter<"ProfessionalProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ProfessionalProfile"> | Date | string
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id" | "accountId">

  export type ProfessionalProfileOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    headline?: SortOrderInput | SortOrder
    organization?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfessionalProfileCountOrderByAggregateInput
    _max?: ProfessionalProfileMaxOrderByAggregateInput
    _min?: ProfessionalProfileMinOrderByAggregateInput
  }

  export type ProfessionalProfileScalarWhereWithAggregatesInput = {
    AND?: ProfessionalProfileScalarWhereWithAggregatesInput | ProfessionalProfileScalarWhereWithAggregatesInput[]
    OR?: ProfessionalProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfessionalProfileScalarWhereWithAggregatesInput | ProfessionalProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ProfessionalProfile"> | string
    accountId?: UuidWithAggregatesFilter<"ProfessionalProfile"> | string
    headline?: StringNullableWithAggregatesFilter<"ProfessionalProfile"> | string | null
    organization?: StringNullableWithAggregatesFilter<"ProfessionalProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProfessionalProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProfessionalProfile"> | Date | string
  }

  export type ProcessedEventWhereInput = {
    AND?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    OR?: ProcessedEventWhereInput[]
    NOT?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    eventId?: UuidFilter<"ProcessedEvent"> | string
    eventType?: StringFilter<"ProcessedEvent"> | string
    processedAt?: DateTimeFilter<"ProcessedEvent"> | Date | string
  }

  export type ProcessedEventOrderByWithRelationInput = {
    eventId?: SortOrder
    eventType?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEventWhereUniqueInput = Prisma.AtLeast<{
    eventId?: string
    AND?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    OR?: ProcessedEventWhereInput[]
    NOT?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    eventType?: StringFilter<"ProcessedEvent"> | string
    processedAt?: DateTimeFilter<"ProcessedEvent"> | Date | string
  }, "eventId">

  export type ProcessedEventOrderByWithAggregationInput = {
    eventId?: SortOrder
    eventType?: SortOrder
    processedAt?: SortOrder
    _count?: ProcessedEventCountOrderByAggregateInput
    _max?: ProcessedEventMaxOrderByAggregateInput
    _min?: ProcessedEventMinOrderByAggregateInput
  }

  export type ProcessedEventScalarWhereWithAggregatesInput = {
    AND?: ProcessedEventScalarWhereWithAggregatesInput | ProcessedEventScalarWhereWithAggregatesInput[]
    OR?: ProcessedEventScalarWhereWithAggregatesInput[]
    NOT?: ProcessedEventScalarWhereWithAggregatesInput | ProcessedEventScalarWhereWithAggregatesInput[]
    eventId?: UuidWithAggregatesFilter<"ProcessedEvent"> | string
    eventType?: StringWithAggregatesFilter<"ProcessedEvent"> | string
    processedAt?: DateTimeWithAggregatesFilter<"ProcessedEvent"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileCreateNestedOneWithoutAccountInput
    talentProfile?: TalentProfileCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileCreateNestedOneWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutAccountInput
    talentProfile?: TalentProfileUncheckedCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileUncheckedCreateNestedOneWithoutAccountInput
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutAccountNestedInput
    talentProfile?: TalentProfileUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUpdateOneWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutAccountNestedInput
    talentProfile?: TalentProfileUncheckedUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUncheckedUpdateOneWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
    avatarMediaId?: string | null
    countryCode?: string | null
    city?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    accountId: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
    avatarMediaId?: string | null
    countryCode?: string | null
    city?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateManyInput = {
    id?: string
    accountId: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
    avatarMediaId?: string | null
    countryCode?: string | null
    city?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TalentProfileCreateInput = {
    id?: string
    status?: $Enums.TalentProfileStatus
    score?: number
    convertedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutTalentProfileInput
  }

  export type TalentProfileUncheckedCreateInput = {
    id?: string
    accountId: string
    status?: $Enums.TalentProfileStatus
    score?: number
    convertedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TalentProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutTalentProfileNestedInput
  }

  export type TalentProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TalentProfileCreateManyInput = {
    id?: string
    accountId: string
    status?: $Enums.TalentProfileStatus
    score?: number
    convertedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TalentProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TalentProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfessionalProfileCreateInput = {
    id?: string
    headline?: string | null
    organization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutProfessionalProfileInput
  }

  export type ProfessionalProfileUncheckedCreateInput = {
    id?: string
    accountId: string
    headline?: string | null
    organization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfessionalProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutProfessionalProfileNestedInput
  }

  export type ProfessionalProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfessionalProfileCreateManyInput = {
    id?: string
    accountId: string
    headline?: string | null
    organization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfessionalProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfessionalProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventCreateInput = {
    eventId: string
    eventType: string
    processedAt?: Date | string
  }

  export type ProcessedEventUncheckedCreateInput = {
    eventId: string
    eventType: string
    processedAt?: Date | string
  }

  export type ProcessedEventUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventUncheckedUpdateInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventCreateManyInput = {
    eventId: string
    eventType: string
    processedAt?: Date | string
  }

  export type ProcessedEventUpdateManyMutationInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventUncheckedUpdateManyInput = {
    eventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type EnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType
  }

  export type EnumAccountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusFilter<$PrismaModel> | $Enums.AccountStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type TalentProfileNullableScalarRelationFilter = {
    is?: TalentProfileWhereInput | null
    isNot?: TalentProfileWhereInput | null
  }

  export type ProfessionalProfileNullableScalarRelationFilter = {
    is?: ProfessionalProfileWhereInput | null
    isNot?: ProfessionalProfileWhereInput | null
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>
  }

  export type EnumAccountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel> | $Enums.AccountStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStatusFilter<$PrismaModel>
    _max?: NestedEnumAccountStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type AccountScalarRelationFilter = {
    is?: AccountWhereInput
    isNot?: AccountWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarMediaId?: SortOrder
    countryCode?: SortOrder
    city?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarMediaId?: SortOrder
    countryCode?: SortOrder
    city?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    username?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarMediaId?: SortOrder
    countryCode?: SortOrder
    city?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTalentProfileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TalentProfileStatus | EnumTalentProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTalentProfileStatusFilter<$PrismaModel> | $Enums.TalentProfileStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TalentProfileCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    convertedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TalentProfileAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type TalentProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    convertedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TalentProfileMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    convertedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TalentProfileSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EnumTalentProfileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TalentProfileStatus | EnumTalentProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTalentProfileStatusWithAggregatesFilter<$PrismaModel> | $Enums.TalentProfileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTalentProfileStatusFilter<$PrismaModel>
    _max?: NestedEnumTalentProfileStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProfessionalProfileCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    headline?: SortOrder
    organization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfessionalProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    headline?: SortOrder
    organization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfessionalProfileMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    headline?: SortOrder
    organization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type ProcessedEventCountOrderByAggregateInput = {
    eventId?: SortOrder
    eventType?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEventMaxOrderByAggregateInput = {
    eventId?: SortOrder
    eventType?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEventMinOrderByAggregateInput = {
    eventId?: SortOrder
    eventType?: SortOrder
    processedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type ProfileCreateNestedOneWithoutAccountInput = {
    create?: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountInput
    connect?: ProfileWhereUniqueInput
  }

  export type TalentProfileCreateNestedOneWithoutAccountInput = {
    create?: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: TalentProfileCreateOrConnectWithoutAccountInput
    connect?: TalentProfileWhereUniqueInput
  }

  export type ProfessionalProfileCreateNestedOneWithoutAccountInput = {
    create?: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfessionalProfileCreateOrConnectWithoutAccountInput
    connect?: ProfessionalProfileWhereUniqueInput
  }

  export type ProfileUncheckedCreateNestedOneWithoutAccountInput = {
    create?: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountInput
    connect?: ProfileWhereUniqueInput
  }

  export type TalentProfileUncheckedCreateNestedOneWithoutAccountInput = {
    create?: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: TalentProfileCreateOrConnectWithoutAccountInput
    connect?: TalentProfileWhereUniqueInput
  }

  export type ProfessionalProfileUncheckedCreateNestedOneWithoutAccountInput = {
    create?: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfessionalProfileCreateOrConnectWithoutAccountInput
    connect?: ProfessionalProfileWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumAccountTypeFieldUpdateOperationsInput = {
    set?: $Enums.AccountType
  }

  export type EnumAccountStatusFieldUpdateOperationsInput = {
    set?: $Enums.AccountStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProfileUpdateOneWithoutAccountNestedInput = {
    create?: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountInput
    upsert?: ProfileUpsertWithoutAccountInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutAccountInput, ProfileUpdateWithoutAccountInput>, ProfileUncheckedUpdateWithoutAccountInput>
  }

  export type TalentProfileUpdateOneWithoutAccountNestedInput = {
    create?: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: TalentProfileCreateOrConnectWithoutAccountInput
    upsert?: TalentProfileUpsertWithoutAccountInput
    disconnect?: TalentProfileWhereInput | boolean
    delete?: TalentProfileWhereInput | boolean
    connect?: TalentProfileWhereUniqueInput
    update?: XOR<XOR<TalentProfileUpdateToOneWithWhereWithoutAccountInput, TalentProfileUpdateWithoutAccountInput>, TalentProfileUncheckedUpdateWithoutAccountInput>
  }

  export type ProfessionalProfileUpdateOneWithoutAccountNestedInput = {
    create?: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfessionalProfileCreateOrConnectWithoutAccountInput
    upsert?: ProfessionalProfileUpsertWithoutAccountInput
    disconnect?: ProfessionalProfileWhereInput | boolean
    delete?: ProfessionalProfileWhereInput | boolean
    connect?: ProfessionalProfileWhereUniqueInput
    update?: XOR<XOR<ProfessionalProfileUpdateToOneWithWhereWithoutAccountInput, ProfessionalProfileUpdateWithoutAccountInput>, ProfessionalProfileUncheckedUpdateWithoutAccountInput>
  }

  export type ProfileUncheckedUpdateOneWithoutAccountNestedInput = {
    create?: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountInput
    upsert?: ProfileUpsertWithoutAccountInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutAccountInput, ProfileUpdateWithoutAccountInput>, ProfileUncheckedUpdateWithoutAccountInput>
  }

  export type TalentProfileUncheckedUpdateOneWithoutAccountNestedInput = {
    create?: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: TalentProfileCreateOrConnectWithoutAccountInput
    upsert?: TalentProfileUpsertWithoutAccountInput
    disconnect?: TalentProfileWhereInput | boolean
    delete?: TalentProfileWhereInput | boolean
    connect?: TalentProfileWhereUniqueInput
    update?: XOR<XOR<TalentProfileUpdateToOneWithWhereWithoutAccountInput, TalentProfileUpdateWithoutAccountInput>, TalentProfileUncheckedUpdateWithoutAccountInput>
  }

  export type ProfessionalProfileUncheckedUpdateOneWithoutAccountNestedInput = {
    create?: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
    connectOrCreate?: ProfessionalProfileCreateOrConnectWithoutAccountInput
    upsert?: ProfessionalProfileUpsertWithoutAccountInput
    disconnect?: ProfessionalProfileWhereInput | boolean
    delete?: ProfessionalProfileWhereInput | boolean
    connect?: ProfessionalProfileWhereUniqueInput
    update?: XOR<XOR<ProfessionalProfileUpdateToOneWithWhereWithoutAccountInput, ProfessionalProfileUpdateWithoutAccountInput>, ProfessionalProfileUncheckedUpdateWithoutAccountInput>
  }

  export type AccountCreateNestedOneWithoutProfileInput = {
    create?: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutProfileInput
    connect?: AccountWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AccountUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutProfileInput
    upsert?: AccountUpsertWithoutProfileInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutProfileInput, AccountUpdateWithoutProfileInput>, AccountUncheckedUpdateWithoutProfileInput>
  }

  export type AccountCreateNestedOneWithoutTalentProfileInput = {
    create?: XOR<AccountCreateWithoutTalentProfileInput, AccountUncheckedCreateWithoutTalentProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutTalentProfileInput
    connect?: AccountWhereUniqueInput
  }

  export type EnumTalentProfileStatusFieldUpdateOperationsInput = {
    set?: $Enums.TalentProfileStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AccountUpdateOneRequiredWithoutTalentProfileNestedInput = {
    create?: XOR<AccountCreateWithoutTalentProfileInput, AccountUncheckedCreateWithoutTalentProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutTalentProfileInput
    upsert?: AccountUpsertWithoutTalentProfileInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutTalentProfileInput, AccountUpdateWithoutTalentProfileInput>, AccountUncheckedUpdateWithoutTalentProfileInput>
  }

  export type AccountCreateNestedOneWithoutProfessionalProfileInput = {
    create?: XOR<AccountCreateWithoutProfessionalProfileInput, AccountUncheckedCreateWithoutProfessionalProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutProfessionalProfileInput
    connect?: AccountWhereUniqueInput
  }

  export type AccountUpdateOneRequiredWithoutProfessionalProfileNestedInput = {
    create?: XOR<AccountCreateWithoutProfessionalProfileInput, AccountUncheckedCreateWithoutProfessionalProfileInput>
    connectOrCreate?: AccountCreateOrConnectWithoutProfessionalProfileInput
    upsert?: AccountUpsertWithoutProfessionalProfileInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutProfessionalProfileInput, AccountUpdateWithoutProfessionalProfileInput>, AccountUncheckedUpdateWithoutProfessionalProfileInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedEnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType
  }

  export type NestedEnumAccountStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusFilter<$PrismaModel> | $Enums.AccountStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | EnumAccountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountType[] | ListEnumAccountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountTypeFilter<$PrismaModel>
  }

  export type NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountStatus | EnumAccountStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountStatus[] | ListEnumAccountStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountStatusWithAggregatesFilter<$PrismaModel> | $Enums.AccountStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountStatusFilter<$PrismaModel>
    _max?: NestedEnumAccountStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTalentProfileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TalentProfileStatus | EnumTalentProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTalentProfileStatusFilter<$PrismaModel> | $Enums.TalentProfileStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTalentProfileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TalentProfileStatus | EnumTalentProfileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TalentProfileStatus[] | ListEnumTalentProfileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTalentProfileStatusWithAggregatesFilter<$PrismaModel> | $Enums.TalentProfileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTalentProfileStatusFilter<$PrismaModel>
    _max?: NestedEnumTalentProfileStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type ProfileCreateWithoutAccountInput = {
    id?: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
    avatarMediaId?: string | null
    countryCode?: string | null
    city?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUncheckedCreateWithoutAccountInput = {
    id?: string
    username?: string | null
    displayName?: string | null
    bio?: string | null
    avatarMediaId?: string | null
    countryCode?: string | null
    city?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileCreateOrConnectWithoutAccountInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
  }

  export type TalentProfileCreateWithoutAccountInput = {
    id?: string
    status?: $Enums.TalentProfileStatus
    score?: number
    convertedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TalentProfileUncheckedCreateWithoutAccountInput = {
    id?: string
    status?: $Enums.TalentProfileStatus
    score?: number
    convertedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TalentProfileCreateOrConnectWithoutAccountInput = {
    where: TalentProfileWhereUniqueInput
    create: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
  }

  export type ProfessionalProfileCreateWithoutAccountInput = {
    id?: string
    headline?: string | null
    organization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfessionalProfileUncheckedCreateWithoutAccountInput = {
    id?: string
    headline?: string | null
    organization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfessionalProfileCreateOrConnectWithoutAccountInput = {
    where: ProfessionalProfileWhereUniqueInput
    create: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
  }

  export type ProfileUpsertWithoutAccountInput = {
    update: XOR<ProfileUpdateWithoutAccountInput, ProfileUncheckedUpdateWithoutAccountInput>
    create: XOR<ProfileCreateWithoutAccountInput, ProfileUncheckedCreateWithoutAccountInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutAccountInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutAccountInput, ProfileUncheckedUpdateWithoutAccountInput>
  }

  export type ProfileUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatarMediaId?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TalentProfileUpsertWithoutAccountInput = {
    update: XOR<TalentProfileUpdateWithoutAccountInput, TalentProfileUncheckedUpdateWithoutAccountInput>
    create: XOR<TalentProfileCreateWithoutAccountInput, TalentProfileUncheckedCreateWithoutAccountInput>
    where?: TalentProfileWhereInput
  }

  export type TalentProfileUpdateToOneWithWhereWithoutAccountInput = {
    where?: TalentProfileWhereInput
    data: XOR<TalentProfileUpdateWithoutAccountInput, TalentProfileUncheckedUpdateWithoutAccountInput>
  }

  export type TalentProfileUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TalentProfileUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTalentProfileStatusFieldUpdateOperationsInput | $Enums.TalentProfileStatus
    score?: IntFieldUpdateOperationsInput | number
    convertedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfessionalProfileUpsertWithoutAccountInput = {
    update: XOR<ProfessionalProfileUpdateWithoutAccountInput, ProfessionalProfileUncheckedUpdateWithoutAccountInput>
    create: XOR<ProfessionalProfileCreateWithoutAccountInput, ProfessionalProfileUncheckedCreateWithoutAccountInput>
    where?: ProfessionalProfileWhereInput
  }

  export type ProfessionalProfileUpdateToOneWithWhereWithoutAccountInput = {
    where?: ProfessionalProfileWhereInput
    data: XOR<ProfessionalProfileUpdateWithoutAccountInput, ProfessionalProfileUncheckedUpdateWithoutAccountInput>
  }

  export type ProfessionalProfileUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfessionalProfileUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    organization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateWithoutProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    talentProfile?: TalentProfileCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileCreateNestedOneWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    talentProfile?: TalentProfileUncheckedCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileUncheckedCreateNestedOneWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutProfileInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
  }

  export type AccountUpsertWithoutProfileInput = {
    update: XOR<AccountUpdateWithoutProfileInput, AccountUncheckedUpdateWithoutProfileInput>
    create: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutProfileInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutProfileInput, AccountUncheckedUpdateWithoutProfileInput>
  }

  export type AccountUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    talentProfile?: TalentProfileUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUpdateOneWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    talentProfile?: TalentProfileUncheckedUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUncheckedUpdateOneWithoutAccountNestedInput
  }

  export type AccountCreateWithoutTalentProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileCreateNestedOneWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutTalentProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutAccountInput
    professionalProfile?: ProfessionalProfileUncheckedCreateNestedOneWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutTalentProfileInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutTalentProfileInput, AccountUncheckedCreateWithoutTalentProfileInput>
  }

  export type AccountUpsertWithoutTalentProfileInput = {
    update: XOR<AccountUpdateWithoutTalentProfileInput, AccountUncheckedUpdateWithoutTalentProfileInput>
    create: XOR<AccountCreateWithoutTalentProfileInput, AccountUncheckedCreateWithoutTalentProfileInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutTalentProfileInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutTalentProfileInput, AccountUncheckedUpdateWithoutTalentProfileInput>
  }

  export type AccountUpdateWithoutTalentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUpdateOneWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutTalentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutAccountNestedInput
    professionalProfile?: ProfessionalProfileUncheckedUpdateOneWithoutAccountNestedInput
  }

  export type AccountCreateWithoutProfessionalProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileCreateNestedOneWithoutAccountInput
    talentProfile?: TalentProfileCreateNestedOneWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutProfessionalProfileInput = {
    id?: string
    userId: string
    type: $Enums.AccountType
    status?: $Enums.AccountStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutAccountInput
    talentProfile?: TalentProfileUncheckedCreateNestedOneWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutProfessionalProfileInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutProfessionalProfileInput, AccountUncheckedCreateWithoutProfessionalProfileInput>
  }

  export type AccountUpsertWithoutProfessionalProfileInput = {
    update: XOR<AccountUpdateWithoutProfessionalProfileInput, AccountUncheckedUpdateWithoutProfessionalProfileInput>
    create: XOR<AccountCreateWithoutProfessionalProfileInput, AccountUncheckedCreateWithoutProfessionalProfileInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutProfessionalProfileInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutProfessionalProfileInput, AccountUncheckedUpdateWithoutProfessionalProfileInput>
  }

  export type AccountUpdateWithoutProfessionalProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutAccountNestedInput
    talentProfile?: TalentProfileUpdateOneWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutProfessionalProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumAccountTypeFieldUpdateOperationsInput | $Enums.AccountType
    status?: EnumAccountStatusFieldUpdateOperationsInput | $Enums.AccountStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutAccountNestedInput
    talentProfile?: TalentProfileUncheckedUpdateOneWithoutAccountNestedInput
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}