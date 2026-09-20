import { IconFileText, IconEye, IconBooks } from "@tabler/icons-react";
import type { ElementType } from "react";
import { useDataProvider } from "@/lib/data-provider";

const iconMap: Record<string, ElementType> = {
  FileText: IconFileText,
  Eye: IconEye,
  Library: IconBooks,
};

export function ValueProps() {
  const { useValueProps: useValuePropsData } = useDataProvider();
  const { data: valueProps } = useValuePropsData();
  return (
    <section className="landing py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>Why it matters</h2>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-sm sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-8 lg:gap-y-16">
          {valueProps.map((prop) => {
            const Icon = iconMap[prop.icon] ?? IconFileText;
            return (
              <div key={prop.label} className="relative pl-9">
                <dt className="inline font-semibold text-foreground">
                  <Icon
                    aria-hidden="true"
                    className="absolute top-1 left-1 size-4 text-primary"
                  />
                  {prop.label}
                </dt>{" "}
                <dd className="inline text-muted-foreground">{prop.body}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
