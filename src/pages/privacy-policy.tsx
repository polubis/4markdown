import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { PrivacyPolicyView } from "features/privacy-policy/privacy-policy.view";
import { meta } from "../../meta";

const PrivacyPolicyPage = () => {
  return <PrivacyPolicyView />;
};

export default PrivacyPolicyPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Privacy Policy`}
      description="Our Privacy Policy details how we handle personal information, including data collected via Google Analytics. Learn about your rights and our commitment to safeguarding your data"
      keywords={`${meta.appName},${meta.appName} Privacy Policy`}
      url={meta.siteUrl + meta.routes.privacyPolicy}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
