import React, { type FormEventHandler } from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { meta } from '../../meta';
import { store } from '../article/store';
import { Button } from 'design-system/button';

type StoreState = {
  username: string;
  users: { id: string; name: string }[];
};

const useUsersStore = store<StoreState>({ users: [], username: `` }, `users`);

const setUsername = (username: string): void => {
  useUsersStore.set({ username });
};

const addUser: FormEventHandler<HTMLFormElement> = (e): void => {
  e.preventDefault();
  useUsersStore.set(({ users, username }) => ({
    users: [...users, { id: new Date().toISOString(), name: username }],
    username: ``,
  }));
};

const NotFoundPage = () => {
  const { users, username } = useUsersStore();

  React.useEffect(() => {
    let currentState = useUsersStore.get();

    const unsubscribe = useUsersStore.subscribe((state) => {
      if (currentState.users.length !== state.users.length) {
        alert(
          `New user has been added! - current users count: ${state.users.length}`,
        );
        currentState = state;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <div className="flex bg-green-100 flex-col justify-center max-w-[350px] p-10 mx-auto">
        <form
          className="mx-auto p-10 flex flex-col justify-center gap-4"
          onSubmit={addUser}
        >
          <input
            className="p-2 rounded-md border border-gray-300"
            type="text"
            name="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button auto s={1} i={1} className="mx-auto" type="submit">
            Add user
          </Button>
        </form>

        {users.length === 0 && (
          <p className="text-center">No users added yet</p>
        )}
        {users.length > 0 && (
          <ul className="p-2 flex flex-col mx-auto">
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}
      </div>

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
