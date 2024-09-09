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
const useUsersStore = store<State>(
  `users`,
  {
    loading: false,
    error: ``,
    users: [],
  },
  // Selectors.
  {
    getUsers: (state) => state.users,
  },
);

// Usage in components.

const usersState = useUsersStore.get();
// Or via selector.
const users = useUsersStore.get(`getUsers`);

const UsersList = () => {
  // Automatically handled by naming convention.
  const { usersState } = useUsersStore();
  // Using selectors.
  const users = useUsersStore(`getUsers`);
};
