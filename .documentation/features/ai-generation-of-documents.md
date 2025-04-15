# AI Document Generation

Users should be able to generate documents using the AI chat window.

## Acceptance Criteria

- Users can define the structure of a document using headings (`#`, `##`, `###`, `####`, `#####`, `######`) within the prompt window. The system will generate a complete article based on this input.

  **Example:**
  ```
  # How to craft a pizza recipe?

  Some content that I've crafted.

  ## Ingredients

  ## Summary

  ### Conclusion
  ```

- The progress of article generation is visible to the user.
- Generation occurs in the background, allowing users to perform other tasks simultaneously.
- The system first attempts to use free models from OpenRouter and switches to paid models if needed, based on traffic.
- Each generation consumes 3 **4markdown tokens**.
- The maximum input size is 2,048 characters.
- Tokens are only deducted when a successful response is generated.
- If the user has already added content between headings, the system should take that content into account and enhance or elaborate on it appropriately.
- After generation, the user can preview the generated document and choose to accept it.
- Upon acceptance, a new document is created using the name initially provided by the user.
- A maximum of 3 generations can occur in real time. Each generation should have its own associated metadata.
- Generated content is temporary and not stored permanently. If a user leaves the site before accepting the content, the generation will be discarded and cannot be retrieved.