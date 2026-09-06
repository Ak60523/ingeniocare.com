import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api";
import { contentStatusLabel } from "../roles";
import { seedSiteContent } from "../../server/contentSeed.js";
import { sortNewestFirst } from "../../server/contentSort.js";
import { contentEditPath, footerNav, isSitePathActive, navPath, primaryNav } from "../siteNav.js";
import NavIcon from "./NavIcons.jsx";

function PageLink({ to, label, note, active, section, icon }) {
  return (
    <Link
      className={`settings-page-link${active ? " is-active" : ""}${section ? " is-section" : ""}`}
      to={to}
      title={label}
      aria-current={active ? "page" : undefined}
    >
      {icon ? <NavIcon name={icon} /> : null}
      <span>{label}</span>
      {note ? <em>{note}</em> : null}
    </Link>
  );
}

function childActive(pathname, to) {
  return pathname === String(to).split("?")[0];
}

export default function SettingsPages({ collapsed = false }) {
  const { pathname } = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [papers, setPapers] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.content("blog").then((data) => data.items || []).catch(() => seedSiteContent.filter((item) => item.type === "blog")),
      api
        .content("whitepaper")
        .then((data) => data.items || [])
        .catch(() => seedSiteContent.filter((item) => item.type === "whitepaper")),
      api
        .content("podcast")
        .then((data) => data.items || [])
        .catch(() => seedSiteContent.filter((item) => item.type === "podcast")),
      api.news().then((data) => data.articles || []).catch(() => []),
    ]).then(([nextBlogs, nextPapers, nextPodcasts, nextNews]) => {
      if (cancelled) return;
      setBlogs(sortNewestFirst(nextBlogs));
      setPapers(sortNewestFirst(nextPapers));
      setPodcasts(sortNewestFirst(nextPodcasts));
      setNews(sortNewestFirst(nextNews));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const childrenByKey = useMemo(
    () => ({
      blog: blogs.map((item) => ({
        to: contentEditPath({ ...item, type: "blog" }),
        label: item.title || "Untitled",
        note: contentStatusLabel(item),
      })),
      whitepaper: papers.map((item) => ({
        to: contentEditPath({ ...item, type: "whitepaper" }),
        label: item.title || "Untitled",
        note: contentStatusLabel(item),
      })),
      podcast: podcasts.map((item) => ({
        to: contentEditPath({ ...item, type: "podcast" }),
        label: item.title || "Untitled",
        note: contentStatusLabel(item),
      })),
      news: news.map((item) => ({
        to: `/${item.slug}?mode=edit`,
        label: item.title || item.headline || "Untitled",
        note: contentStatusLabel({ ...item, status: item.status || "published" }),
      })),
    }),
    [blogs, news, papers, podcasts]
  );

  return (
    <nav className={`settings-pages${collapsed ? " is-collapsed" : ""}`} aria-label="Site pages">
      {primaryNav.map((item) => {
        if (item.children?.length) {
          if (collapsed) {
            return (
              <PageLink
                key={item.id}
                to={item.to || item.children[0].to}
                label={item.label}
                icon={item.icon}
                active={isSitePathActive(pathname, item)}
              />
            );
          }
          return (
            <div key={item.id} className="settings-pages-item">
              <p className="settings-pages-group">{item.label}</p>
              {item.children.map((child) => (
                <PageLink
                  key={child.id}
                  to={child.to}
                  label={child.label}
                  active={isSitePathActive(pathname, child)}
                />
              ))}
            </div>
          );
        }

        const children = childrenByKey[item.childrenKey] || [];
        const childIsActive = children.some((child) => childActive(pathname, child.to));
        const selfActive = isSitePathActive(pathname, item) && !childIsActive;
        const sectionActive = isSitePathActive(pathname, item) || childIsActive;
        if (collapsed) {
          return (
            <PageLink
              key={item.id}
              to={navPath(item, { edit: true })}
              label={item.label}
              icon={item.icon}
              active={selfActive || sectionActive}
            />
          );
        }
        return (
          <div key={item.id} className="settings-pages-item">
            <PageLink
              to={navPath(item, { edit: true })}
              label={item.label}
              icon={item.icon}
              active={selfActive}
              section={sectionActive && !selfActive}
            />
            {children.length ? (
              <div className="settings-pages-children">
                {children.map((child) => (
                  <PageLink
                    key={child.to}
                    to={child.to}
                    label={child.label}
                    note={child.note}
                    active={childActive(pathname, child.to)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      {collapsed ? null : <p className="settings-pages-group">Footer</p>}
      {footerNav.map((item) => (
        <PageLink
          key={item.id}
          to={item.to}
          label={item.label}
          icon={item.icon}
          active={isSitePathActive(pathname, item)}
        />
      ))}
    </nav>
  );
}
