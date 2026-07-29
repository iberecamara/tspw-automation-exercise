/**
 * Custom error type thrown by framework code (as opposed to the application under test) when a
 * method is misused or an internal invariant is violated — e.g. an unexpected API response
 * shape, or a helper called with arguments it can't satisfy. Distinguishing these from generic
 * `Error`s makes it easier to tell "the framework itself hit a bug" apart from an assertion
 * failure or a Playwright timeout when triaging a failed run.
 */
export class TestAutomationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestAutomationException";
  }
}
