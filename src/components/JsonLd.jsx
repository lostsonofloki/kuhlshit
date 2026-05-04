import { Helmet } from "react-helmet-async";

/**
 * Injects a JSON-LD graph into document head. Pass stable `id` so updates replace the same node.
 */
export default function JsonLd({ id, data }) {
  return (
    <Helmet>
      <script id={id} type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
