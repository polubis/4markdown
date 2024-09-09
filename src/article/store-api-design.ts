import { store } from 'morph/store';

type User = {
  id: string;
  name: string;
};

type State = {
  loading: boolean;
  error: string;
  users: User[];
};

// Named API methods are returned.
const { useUsersStore } = store<State>(
  `users`,
  {
    loading: false,
    error: ``,
    users: [],
  },
  // Selectors.
  {
    getUsers: ({ usersState }) => usersState.users,
  },
  {
    // Configuration options.
    debug: process.env.NODE_ENV === `development`,
  },
);

export { useUsersStore };

// Usage in Components.

import { useUsersStore } from 'store/users';

const { usersState } = useUsersStore.get();
// Or via selector.
const users = useUsersStore.get(`getUsers`);

const UsersList = () => {
  // Automatically handled by naming convention.
  const { usersState } = useUsersStore();
  // Using selectors.
  const users = useUsersStore(`getUsers`);
};
