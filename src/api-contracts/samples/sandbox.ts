import { string, number, object, array, type Infer, min } from 'superstruct';

const getUsersPayload = object({
  limit: min(number(), 1),
});

const getUsersResponse = array(
  object({
    id: number(),
    name: string(),
  }),
);

type GetUsersPayload = Infer<typeof getUsersPayload>;
type GetUsersResponse = Infer<typeof getUsersResponse>;

export { getUsersPayload, getUsersResponse };
export type { GetUsersPayload, GetUsersResponse };

// Validating...

const payload: unknown = {};

if (getUsersPayload.is(payload)) {
  // Here it's 100% shape of `GetUserPayload`
  console.log(payload.limit);
}

// Here it's still "unknown"
