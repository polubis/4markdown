# Payment Tokens Mechanism

The system is generally free to use, but certain actions require payment using the application vault — specifically, **4markdown tokens**.

## Acceptance Criteria

- When a user starts using a feature that requires token payment, the corresponding number of tokens is deducted from their balance.
- If a user attempts to use a token-required feature with a token balance of 0, the system displays a specific error message.
- The system restores the default weekly token allowance (50 tokens) **only** when a token-requiring operation is triggered. This prevents unnecessary background jobs from running.
- Users can view their current token balance.
- Users can see when their next token allowance will be added.
- Weekly token additions work as follows:  
  For example, if a user has 30 tokens, and a new week begins, the token balance becomes `30 + 50 = 80`.
- If a user already has more than 50 tokens, the weekly token addition is **not** performed.