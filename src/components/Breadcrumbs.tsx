import { Link, useLocation, matchPath } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useMemo, Fragment } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ROUTES, routeIndex } from '@/lib/routeMeta';

export interface RouteMeta {
  path: string;
  label: string;
  parent?: string;
  dynamic?: boolean;
}

// ROUTES + routeIndex imported from lib/routeMeta

function resolveMatch(pathname: string) {
  return (
    ROUTES.filter((r) => matchPath({ path: r.path, end: true }, pathname)).sort(
      (a, b) => b.path.length - a.path.length
    )[0] || null
  );
}

function buildTrail(finalMeta: RouteMeta | null): RouteMeta[] {
  if (!finalMeta) return [];
  const chain: RouteMeta[] = [finalMeta];
  let current = finalMeta;
  const safety = 10;
  let i = 0;
  while (current.parent && i < safety) {
    const parentMeta = routeIndex.get(current.parent);
    if (!parentMeta) break;
    chain.unshift(parentMeta);
    current = parentMeta;
    i++;
  }
  return chain;
}

export const Breadcrumbs = ({ currentLabel }: { currentLabel?: string }) => {
  const location = useLocation();
  const flowerItems = useAppSelector((s) => s.flowers.items);
  const bouquetItems = useAppSelector((s) => s.bouquets.items);

  const trail = useMemo(() => {
    const match = resolveMatch(location.pathname);
    if (match && match.path === '/product/:slug') {
      const slug = location.pathname.split('/').pop() || '';
      const isFlower = flowerItems.some((f) => f.slug === slug);
      const parentPath = isFlower ? '/flowers' : '/bouquets';
      const home = routeIndex.get('/')!;
      const parent = routeIndex.get(parentPath)!;
      const productMeta: RouteMeta = { ...match, parent: parentPath };
      return [home, parent, productMeta];
    }
    return buildTrail(match);
  }, [location.pathname, flowerItems]);

  if (!trail.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((r, idx) => {
          const isLast = idx === trail.length - 1;
          const label = isLast && currentLabel ? currentLabel : r.label;
          return (
            <Fragment key={r.path + idx}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={r.path.replace(':slug', '') || '/'}>{r.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
