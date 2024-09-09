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
  `users`, // Identifier of the store.
  {
    loading: false,
    error: ``,
    users: [],
  },
  // Selectors.
  {
    users: (state) => state.users,
  },
);

// Read outside of components.
const usersState = useUsersStore.get();
const users = useUsersStore.get(`users`);
const custom = useUsersStore((state) => state.users);

// Read inside components.
const UsersList = () => {
  const usersState = useUsersStore();
  const users = useUsersStore(`users`);
  const custom = useUsersStore((state) => state.users);
};
