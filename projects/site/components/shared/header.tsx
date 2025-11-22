"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/site/utils";

import Link from "next/link";
import { LuCode } from "react-icons/lu";

import styles from "@/site/styles/shared/header.module.scss";
import { navigationSchema } from "@/site/lib";

interface Props {}

const Header: React.FC<Props> = ({}) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.container}>
      <div className="root_container">
        <div className={styles.content}>
          <div className={styles.navigation}>
            <h1 className={styles.logo}>
              <LuCode size={28} strokeWidth={1.75} />
              <span className={styles.logo_text}>Hakaton</span>
            </h1>
            <nav className={styles.navigation_list}>
              {navigationSchema.map((item) => (
                <Link
                  key={item.href}
                  className={cn(
                    styles.navigation_item,
                    isActive(item.href) && styles.navigation_item__active
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className={styles.personal_data}>
            <Link href="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.displayName = "Header";

export { Header };
