import { action } from 'morph/action';
import { getUsers } from 'services/users';

// State snapshot is automatically injected by a given store name.
const loadUsers = action<{ id: number }>(
  `users`,
  // Type is automatically detected by the used store name.
  async ({ set, payload, get }) => {
    // Other store state.
    const { postsState } = get('posts');

    if (state.loading) return;

    try {
      set({ loading: true; error: "" });

      const users = await getUsers(payload.id);

      set({ users, loading: false });
    } catch {
      set({ loading: false, error: `Something went wrong` });
    }
  },
);

export { loadUsers };