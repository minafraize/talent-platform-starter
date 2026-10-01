export interface ProfileFailureInjector {
  shouldFailAfterAccountCreation(): boolean;
}