import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Sitemap uppercase URL support without redirect.
  if (pathname === "/Sitemap-blog.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap-blog.xml";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/Sitemap.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap.xml";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/Sitemap-pages.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap-pages.xml";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/Sitemap-products.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/sitemap-products.xml";
    return NextResponse.rewrite(url);
  }

  // Blog old URL to new URL.
  if (pathname === "/blog") {
    const url = request.nextUrl.clone();
    url.pathname = "/blogs";
    return NextResponse.redirect(url, 301);
  }

  // Old wall page to current mono wall page.
  if (pathname === "/puf-panel-for-wall") {
    const url = request.nextUrl.clone();
    url.pathname = "/products/mono-wall";
    return NextResponse.redirect(url, 301);
  }

  // Old roof page to current roof panel page.
  if (pathname === "/puf-panel-roof") {
    const url = request.nextUrl.clone();
    url.pathname = "/products/roof-panel";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Sitemap-blog.xml",
    "/Sitemap.xml",
    "/Sitemap-pages.xml",
    "/Sitemap-products.xml",
    "/blog",
    "/puf-panel-for-wall",
    "/puf-panel-roof",
  ],
};