import { useUsersStore } from 'store/users';
import { getUsers } from 'services/users';

const loadUsers = async (id: number) => {
  const { get, set } = useUsersStore;

  const state = get();

  if (state.loading) return;

  try {
    set({ loading: true, error: '' });

    const users = await getUsers(id);

    set({ users, loading: false });
  } catch {
    set({ loading: false, error: `Something went wrong` });
  }
};

export { loadUsers };
