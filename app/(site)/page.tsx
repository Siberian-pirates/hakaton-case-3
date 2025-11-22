import { Header } from "@/site/components/shared/header";
import styles from "./page.module.scss";

export default function SiteHomePage() {
  return (
    <>
      <Header />
      <main>
        <div className="root_container">
          <div className={styles.jobs_container}>
            <div className={styles.jobs_filtres}>123</div>
            <div className={styles.jobs_list}>321</div>
          </div>
        </div>
      </main>
    </>
  );
}
