import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { useForm } from 'development-kit/use-form';
import React from 'react';


const NewMindmapView = () => {
  const form = useForm();

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <main className="max-w-2xl p-4 mx-auto h-screen flex flex-col justify-center">
        <h1 className="text-2xl">Create Mindmap</h1>
        <form></form>
        <p className="mt-2"></p>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { NewMindmapView };
