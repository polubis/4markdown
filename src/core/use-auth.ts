import React from "react";
import { authStoreActions } from "store/auth/auth.store";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions } from "store/doc/doc.store";
import { docsStoreActions } from "store/docs/docs.store";
import { useYourUserProfileState } from "store/your-user-profile";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { useYourAccountState } from "store/your-account";
import { initializeAPI } from "api-4markdown";
import { graphql, useStaticQuery } from "gatsby";
import { SiteMetadata } from "./models";

type SiteMetadataQuery = {
  site: {
    siteMetadata: Pick<SiteMetadata, "buildStamp">;
  };
};

const useAuth = () => {
  const data = useStaticQuery<SiteMetadataQuery>(graphql`
    query BuildStampQuery {
      site {
        siteMetadata {
          buildStamp
        }
      }
    }
  `);

  const [api] = React.useState(() =>
    initializeAPI(data.site.siteMetadata.buildStamp),
  );

  React.useEffect(() => {
    const unsubscribe = api.onAuthChange((user) => {
      if (user) {
        authStoreActions.authorize({
          avatar: user.photoURL,
          name: user.displayName,
          uid: user.uid,
        });

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();
      useYourUserProfileState.reset();
      authStoreActions.unauthorize();
      useMindmapCreatorState.reset();
      useYourAccountState.reset();
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

export { useAuth };
