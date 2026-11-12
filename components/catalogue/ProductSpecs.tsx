import { formatDimensions } from "@/lib/format";
import type { Labels, Product } from "@/lib/schemas";

type Props = { product: Product; labels: Labels["product"] };

/** Specification list. Rows without data are omitted (incl. the optional MOQ / lead time). */
export function ProductSpecs({ product, labels }: Props) {
  const dims = formatDimensions(product.dimensions);
  const rows: [string, React.ReactNode][] = [
    [labels.code, product.code],
    [
      labels.dimensions,
      dims || product.dimensions.note ? (
        <>
          {dims}
          {product.dimensions.note && (
            <span className="block text-muted">{product.dimensions.note}</span>
          )}
        </>
      ) : null,
    ],
    [labels.materials, product.materials.join(", ")],
    [labels.colours, product.colours.join(", ")],
    [labels.technique, product.technique],
    [labels.finish, product.finish],
    [labels.weight, product.weightKg ? `${product.weightKg} kg` : null],
    [labels.care, product.care],
    [labels.moq, product.moq],
    [labels.leadTime, product.leadTime],
  ];
  return (
    <dl className="divide-y divide-hairline border-y border-hairline text-body-sm">
      {rows
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(7rem,35%)_1fr] gap-4 py-3.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
    </dl>
  );
}
