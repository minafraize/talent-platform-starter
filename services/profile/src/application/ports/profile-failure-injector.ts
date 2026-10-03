export interface ProfileFailureInjector {
  shouldFailAfterAccountCreation(): boolean;

  shouldFailAfterAccountTypeChange(): boolean;
}