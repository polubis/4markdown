It's some code example with `inline=a`:

```
// Some imagined framework code
controller(`users/{id}`, async (_, rawPayload) => {
  // Validation
  const { id } = parse(rawPayload);
  // Getting user from DB by "id"
  const user = await getUser(id);

  return user;
});
```