export interface OutboxFailureInjector {
  shouldFail(): boolean;
}