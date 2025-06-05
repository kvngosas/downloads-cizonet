export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    res.status(400).send("File not specified");
    return;
  }

  const filePath = Array.isArray(slug) ? slug.join("/") : slug;

  const bucketBaseUrl = "https://pub-19bae00d2da848aaa246f6a34853e7be.r2.dev";

  const fileUrl = `${bucketBaseUrl}/${filePath}`;

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      res.status(response.status).send("File not found");
      return;
    }

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filePath.split("/").pop()}"`
    );

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Error fetching file");
  }
}
