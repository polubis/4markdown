import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { LoginView } from "features/auth/login.view";

const LoginPage = () => {
  return <LoginView />;
};

export default LoginPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Login`}
      description="Sign in to 4Markdown to access your documents, saved settings, and account tools."
      keywords={`${meta.appName},login,sign in`}
      url={meta.siteUrl + meta.routes.auth.login}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
