import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { RegisterView } from "features/auth/register.view";

const RegisterPage = () => {
  return <RegisterView />;
};

export default RegisterPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Register`}
      description="Create a 4Markdown account to save documents, manage access, and personalize your workspace."
      keywords={`${meta.appName},register,sign up`}
      url={meta.siteUrl + meta.routes.auth.register}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
