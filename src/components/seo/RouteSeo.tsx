/**
 * RouteSeo.tsx
 * ------------
 * Per-route <title>, <meta name="description">, canonical, and og:* tags
 * powered by react-helmet-async. Ensures each public marketing route has
 * a unique, self-referencing head so search engines can differentiate
 * them (fixes "Pages share the same title and description").
 */

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://kwendi.xyz";

interface RouteSeoProps {
  title: string;
  description: string;
  path: string;
}

export const RouteSeo = ({ title, description, path }: RouteSeoProps) => {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default RouteSeo;