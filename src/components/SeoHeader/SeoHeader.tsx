import React, { Fragment } from "react";
import Head from "next/head";
const SeoHeader = props => {
  const { title, description, keywords, image, date, website, type } = props;
  const domain = window.location.href;
  const jsonLd = JSON.stringify(
    type === "news"
      ? {
          "@context": website,
          "@type": "NewsArticle",
          url: domain,
          publisher: {
            "@type": "Organization",
            name: "YNH News",
            logo: image,
          },
          headline: title,
          mainEntityOfPage: domain,
          articleBody: description,
          image: image,
          datePublished: date,
        }
      : {
          "@context": website,
          "@type": "Product",
          description: description,
          name: title,
          image: image,
          releaseDate: date,
          url: domain,
        }
  );

  return (
    <Fragment>
      <Head>
        {/* seo tag of google */}
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        {/* seo tag of facebook */}
        <meta property='og:type' content='website' />
        <meta name='og:title' property='og:title' content={title} />
        <meta name='og:description' property='og:description' content={description} />
        <meta property='og:site_name' content={website} />
        <meta property='og:url' content={`${domain}`} />
        <meta property='og:image' content={image} />
        {/* seo tag of twitter*/}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:site' content={website} />
        <meta name='twitter:creator' content='YNH' />
        <meta name='twitter:image' content={image} />
        {/* script for news and drops */}
        <script type='application/ld+json'>{jsonLd}</script>
      </Head>
    </Fragment>
  );
};

export default SeoHeader;
