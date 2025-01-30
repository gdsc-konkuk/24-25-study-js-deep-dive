import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = (
  <Banner storageKey="some-key">🎉 Welcome to JS World!!! 🎉</Banner>
);
const navbar = (
  <Navbar
    logo={
      <b style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img
          src="https://avatars.githubusercontent.com/u/140731649?s=200&v=4"
          width="40px"
        />
        <strong>GDG On Campus Konkuk</strong>
      </b>
    }
    // ... Your additional navbar options
  />
);
const footer = (
  <Footer>MIT {new Date().getFullYear()} © GDG On Campus Konkuk</Footer>
);

export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="ko"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        // ... Your additional head options
        children={
          <link
            rel="icon"
            href="https://avatars.githubusercontent.com/u/140731649?s=200&v=4"
            sizes="any"
          />
        }
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/gdsc-konkuk/24-25-study-js-deep-dive"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
