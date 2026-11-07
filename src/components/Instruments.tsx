import { capabilities } from "@/content/capabilities";
import { features } from "@/content/projects";

const cols = features.map((f) => ({ slug: f.slug, title: f.title }));
const colTitles = new Set(cols.map((c) => c.title));

/**
 * Technologies as an evidence matrix: one row per technology, one column per
 * featured project, a mark where the repository uses it, and a count of the
 * supporting projects that also do. No proficiency scores — only where it was used.
 */
export function Instruments({ n = "03" }: { n?: string }) {
  return (
    <section id="instruments" className="section instruments" aria-labelledby="inst-h">
      <header className="folio" data-reveal>
        <span>{n}</span>
        <h2 id="inst-h">Instruments</h2>
        <p>What was used, and where. A mark means the technology is used in that project.</p>
      </header>

      <div className="inst__groups">
        {capabilities.map((g) => (
          <div key={g.id} className="inst__group" data-reveal>
            <div className="inst__head">
              <h3>{g.title}</h3>
              <p>{g.blurb}</p>
            </div>
            <table className="inst__table">
              <caption className="sr-only">{g.title}: where each technology appears</caption>
              <thead>
                <tr>
                  <th scope="col" className="sr-only">
                    Technology
                  </th>
                  {cols.map((c) => (
                    <th key={c.slug} scope="col" className="inst__col">
                      <abbr title={c.title}>{c.title === "Museum Artifact Explorer" ? "Museum" : c.title}</abbr>
                    </th>
                  ))}
                  <th scope="col" className="inst__col inst__col--more">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.items.map((it) => {
                  const others = it.seenIn.filter((s) => !colTitles.has(s));
                  return (
                    <tr key={it.name}>
                      <th scope="row">{it.name}</th>
                      {cols.map((c) => {
                        const has = it.seenIn.includes(c.title);
                        return (
                          <td key={c.slug} className={has ? "is-on" : undefined}>
                            <span aria-hidden="true">{has ? "●" : "·"}</span>
                            <span className="sr-only">{has ? `Used in ${c.title}` : `Not in ${c.title}`}</span>
                          </td>
                        );
                      })}
                      <td className="inst__more" title={others.join(", ")}>
                        {others.length ? (
                          <>
                            <span aria-hidden="true">{others.length}</span>
                            <span className="sr-only">Also used in: {others.join(", ")}</span>
                          </>
                        ) : (
                          <span aria-hidden="true">·</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
