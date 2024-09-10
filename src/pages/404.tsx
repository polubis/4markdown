import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { meta } from '../../meta';
import { store } from '../article/store';

type StoreState = {
  username: string;
  users: { id: string; name: string }[];
};

const useUsersStore = store<StoreState>({ users: [], username: `` }, `users`);

const setUsername =
  () =>
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    useUsersStore.set({ username: event.target.value });
  };

const addUser = (): void => {
  useUsersStore.set(({ users, username }) => ({
    users: [...users, { id: new Date().toISOString(), name: username }],
    username: ``,
  }));
};

const NotFoundPage = () => {
  const { users, username } = useUsersStore();

  React.useEffect(() => {
    const unsubscribe = useUsersStore.subscribe((state) => {
      console.log(state);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <form onSubmit={addUser}>
        <input
          type="text"
          name="name"
          value={username}
          onChange={setUsername}
        />
        <button type="submit">Add user</button>
      </form>

      {users.length === 0 && <p>No users added yet</p>}
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      <AppFooterContainer />
    </>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.notFound}
      lang={meta.lang}
      image={LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
